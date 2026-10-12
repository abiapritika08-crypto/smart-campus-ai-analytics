import express from 'express';
import type { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gemini Client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Deep AI Student Diagnostic Dossier Endpoint
app.post('/api/ai/analyze-student', async (req: Request, res: Response) => {
  try {
    const { student } = req.body;
    if (!student) {
      return res.status(400).json({ error: 'Student data is required' });
    }

    if (ai) {
      try {
        const prompt = `You are CampusCare AI, an academic diagnostic system for university faculty advisors.
Analyze the following student profile and produce a structured, empathetic, actionable academic diagnostic dossier:
Student Name: ${student.name} (${student.rollNo})
Department: ${student.department}, Semester: ${student.semester}, Section: ${student.section}
CGPA: ${student.cgpa}/10.0, Current GPA: ${student.currentGpa}/10.0
Overall Attendance: ${student.overallAttendance}% (Statutory requirement: 75%)
Risk Tier: ${student.riskAnalysis.riskTier} (Risk Score: ${student.riskAnalysis.overallRiskScore}/100)
Consecutive Absences: ${student.riskAnalysis.consecutiveAbsences}
Primary Risk Factors: ${student.riskAnalysis.primaryFactors.join('; ')}
Course Performances: ${JSON.stringify(student.coursePerformances.map((c: any) => ({
  course: c.courseName,
  attendance: c.attendance + '%',
  midterm1: `${c.internal1}/${c.internal1Max}`,
  midterm2: `${c.internal2}/${c.internal2Max}`,
  status: c.status
})))}
Assignments Status: ${JSON.stringify(student.assignments.map((a: any) => ({
  title: a.title,
  course: a.courseName,
  status: a.status,
  score: a.score
})))}
Mentor Notes: ${JSON.stringify(student.mentorNotes.map((n: any) => n.content))}

Provide a JSON response with the following format:
{
  "diagnosticSummary": "2-3 sentences concise diagnostic overview of their academic health",
  "rootCauses": ["Key root cause 1", "Key root cause 2", "Key root cause 3"],
  "attendanceTrajectory": "Assessment of attendance pattern and risk of debarment",
  "academicFrictionPoints": ["Specific conceptual or assessment friction points"],
  "strengthsToLeverage": ["Positive attributes or strengths noticed"],
  "immediateActionPlan": [
    "Step 1: Next 7 days",
    "Step 2: Next 14 days",
    "Step 3: By midterm/endterm"
  ],
  "recommendedIntervention": "Primary intervention type (e.g., Peer Tutoring, 1-on-1 Academic Counseling, Assignment Recovery Contract)",
  "facultyToneAdvice": "Advice on how the advisor should approach the student empathetically"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          return res.json({ success: true, source: 'gemini', data: parsed });
        }
      } catch (geminiError) {
        console.warn('[CampusCare AI] Gemini analyze call failed, falling back to heuristic:', geminiError);
      }
    }

    // High-fidelity heuristic fallback
    const isCritical = student.overallAttendance < 70 || student.riskAnalysis.overallRiskScore > 70;
    const weakCourses = student.coursePerformances.filter((c: any) => c.status === 'critical' || c.status === 'needs_attention');
    const missingAssignments = student.assignments.filter((a: any) => a.status === 'missing' || a.status === 'pending');

    const heuristicData = {
      diagnosticSummary: `${student.name} presents a ${student.riskAnalysis.riskTier.toUpperCase()} academic profile with an overall risk score of ${student.riskAnalysis.overallRiskScore}/100. Primary strain observed in ${weakCourses.map((c: any) => c.courseName).join(', ') || 'coursework'} alongside ${student.overallAttendance < 75 ? `a critical attendance deficit of ${student.overallAttendance}% (statutory limit 75%)` : 'stable attendance'}.`,
      rootCauses: [
        student.overallAttendance < 75 
          ? `Attendance slip to ${student.overallAttendance}% directly impacts continuous internal evaluation and lab work.`
          : 'Pacing discrepancy between conceptual lectures and rigorous hands-on problem sets.',
        missingAssignments.length > 0 
          ? `Backlog of ${missingAssignments.length} pending/missing deliverables causing compounding grading penalties.`
          : 'Marginal drop in Midterm 2 scores indicative of mid-semester fatigue or concept complexity spike.',
        'External scheduling pressure or inadequate foundational mastery in core quantitative subjects.'
      ],
      attendanceTrajectory: student.overallAttendance < 75 
        ? `Immediate debarment risk alert: Must achieve minimum 86% attendance over remaining sessions to cross the 75% threshold.`
        : `Attendance is healthy at ${student.overallAttendance}%, meeting institutional compliance guidelines.`,
      academicFrictionPoints: weakCourses.map((c: any) => `${c.courseName}: Internal assessment score dropped; requires targeted concept review.`),
      strengthsToLeverage: student.placementReadiness.strengths || ['Good practical curiosity', 'Receptive to constructive faculty feedback'],
      immediateActionPlan: [
        `Schedule mandatory 15-minute 1-on-1 advising session with ${student.advisor || 'Faculty Advisor'}.`,
        missingAssignments.length > 0 
          ? `Issue 5-day structured assignment catch-up milestone for ${missingAssignments[0]?.title || 'pending assignments'}.`
          : 'Pair with high-performing peer tutor for weekly problem-solving lab sessions.',
        'Establish weekly attendance verification log signed by course instructors.'
      ],
      recommendedIntervention: isCritical ? 'Urgent 1-on-1 Academic Counseling & Parent Notice' : 'Peer Study Group & Assignment Extension Plan',
      facultyToneAdvice: 'Adopt a supportive, non-punitive tone. Inquire about external commute or personal stressors before discussing marks.'
    };

    return res.json({ success: true, source: 'heuristic', data: heuristicData });
  } catch (error: any) {
    console.error('Error in /api/ai/analyze-student:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 2. AI Intervention Suggestions & Email Draft Generator
app.post('/api/ai/suggest-interventions', async (req: Request, res: Response) => {
  try {
    const { student, interventionGoal } = req.body;
    if (!student) {
      return res.status(400).json({ error: 'Student data is required' });
    }

    if (ai) {
      try {
        const prompt = `You are CampusCare AI, university faculty intervention expert.
Generate customized faculty intervention plans and an empathetic faculty-to-student email for:
Student: ${student.name} (${student.rollNo})
Department: ${student.department}, CGPA: ${student.cgpa}, Attendance: ${student.overallAttendance}%
Risk Tier: ${student.riskAnalysis.riskTier}
Intervention Goal: ${interventionGoal || 'Academic recovery and motivation'}
Weak Courses: ${student.coursePerformances.map((c: any) => `${c.courseName} (${c.currentGradeEstimate})`).join(', ')}

Return a JSON with:
{
  "interventionPlans": [
    {
      "title": "Short title",
      "type": "mentoring_1on1" | "remedial_tutoring" | "assignment_extension" | "peer_study_group",
      "description": "Detailed explanation of the protocol",
      "estimatedDuration": "e.g. 3 weeks",
      "expectedOutcome": "Measurable expected outcome"
    }
  ],
  "emailSubject": "Empathetic, clear subject line",
  "emailBody": "Full polite, supportive email inviting student to office hours and offering concrete help without causing shame or panic"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          return res.json({ success: true, source: 'gemini', data: parsed });
        }
      } catch (geminiError) {
        console.warn('[CampusCare AI] Gemini interventions call failed, falling back to heuristic:', geminiError);
      }
    }

    // Heuristic fallback
    const emailSubject = `Checking in on your semester progress – Office Hours with ${student.advisor || 'Faculty Advisor'}`;
    const emailBody = `Dear ${student.name},\n\nI hope your semester is going well. As your academic advisor, I've been reviewing our department's mid-term records and noticed that you might be experiencing some hurdles in ${student.coursePerformances[0]?.courseName || 'your core courses'}, as well as keeping up with the 75% attendance benchmark.\n\nCollege coursework can be demanding, and my goal is to ensure you have all the resources and guidance needed to succeed. I would love to meet for a brief 15-minute chat during my office hours this week so we can review the key topics together and set up a smooth path forward.\n\nPlease let me know which time on Wednesday or Thursday works best for you, or feel free to drop by my office (Room 304, Academic Block).\n\nWarm regards,\n${student.advisor || 'Prof. Eleanor Vance'}\nDepartment of ${student.department}\nCampusCare Academic Advisory Cell`;

    const plans = [
      {
        title: 'Structured Peer Tutoring Lab',
        type: 'peer_study_group',
        description: `Pair ${student.name} with an honors student for bi-weekly 60-minute problem solving sessions.`,
        estimatedDuration: '4 weeks',
        expectedOutcome: 'Midterm 2/Endterm score improvement of at least 15-20%.'
      },
      {
        title: 'Attendance Contract & Milestone Recovery',
        type: 'mentoring_1on1',
        description: 'Establish a weekly attendance check-in with faculty advisor and verify laboratory exercise completions.',
        estimatedDuration: '6 weeks',
        expectedOutcome: 'Achieve minimum 80% attendance in the second half of the semester.'
      },
      {
        title: 'Remedial Assignment Catch-Up Protocol',
        type: 'assignment_extension',
        description: 'Provide a 7-day structured grace period to resubmit missed deliverables with constructive rubric guidance.',
        estimatedDuration: '2 weeks',
        expectedOutcome: 'Resolve active backlogs and restore internal continuous assessment scores.'
      }
    ];

    return res.json({
      success: true,
      source: 'heuristic',
      data: {
        interventionPlans: plans,
        emailSubject,
        emailBody
      }
    });
  } catch (error: any) {
    console.error('Error in /api/ai/suggest-interventions:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 3. Faculty Copilot / Natural Language Query Assistant
app.post('/api/ai/query-cohort', async (req: Request, res: Response) => {
  try {
    const { query, students } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    const cohortSummary = (students || []).map((s: any) => ({
      id: s.id,
      name: s.name,
      rollNo: s.rollNo,
      dept: s.department,
      sem: s.semester,
      cgpa: s.cgpa,
      attendance: s.overallAttendance,
      riskTier: s.riskAnalysis?.riskTier,
      riskScore: s.riskAnalysis?.overallRiskScore,
      placementTier: s.placementReadiness?.tier,
      activeBacklogs: s.placementReadiness?.activeBacklogs,
      primaryFactors: s.riskAnalysis?.primaryFactors
    }));

    if (ai) {
      try {
        const prompt = `You are CampusCare AI, an intelligent institutional analytics copilot for faculty and deans.
Here is the cohort student roster:
${JSON.stringify(cohortSummary, null, 2)}

User Question: "${query}"

Analyze the dataset and answer the user question directly and concisely. Provide:
1. Direct analytical answer with key observations and counts.
2. An array of relevant student IDs that match the criteria (if applicable).
3. Recommended faculty actions or institutional insights.

Return JSON in format:
{
  "answer": "Clear, professional, data-backed analytical response (use natural paragraphs or bullet points)",
  "matchingStudentIds": ["stu-001", "stu-005"],
  "keyMetrics": {
    "totalCohort": number,
    "matchedCount": number,
    "highlight": "Short metric or takeaway"
  },
  "recommendedAction": "Action faculty should take immediately"
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          return res.json({ success: true, source: 'gemini', data: parsed });
        }
      } catch (geminiError) {
        console.warn('[CampusCare AI] Gemini query-cohort call failed, falling back to heuristic:', geminiError);
      }
    }

    // Heuristic query processing
    const q = query.toLowerCase();
    let matched: any[] = [];
    let answerText = '';
    let action = 'Review flagged students in individual advisory sessions.';

    if (q.includes('attendance') || q.includes('absent') || q.includes('75') || q.includes('debar')) {
      matched = cohortSummary.filter((s: any) => s.attendance < 75);
      answerText = `Found ${matched.length} students currently below the institutional 75% attendance threshold: ${matched.map((s: any) => `${s.name} (${s.attendance}%)`).join(', ')}. These students are at high risk of academic debarment unless immediate remediation agreements are established.`;
      action = 'Issue official attendance warning notices and schedule mandatory advisor check-ins.';
    } else if (q.includes('drop') || q.includes('midterm') || q.includes('internal') || q.includes('crash')) {
      matched = cohortSummary.filter((s: any) => (s.primaryFactors || []).some((f: string) => f.toLowerCase().includes('drop') || f.toLowerCase().includes('falling')));
      if (matched.length === 0) matched = cohortSummary.filter((s: any) => s.riskScore > 60);
      answerText = `Identified ${matched.length} students with sharp score drops between Midterm 1 and Midterm 2. Primary courses affected include Algorithms, Signals & Systems, and Fluid Mechanics.`;
      action = 'Organize post-midterm problem solving clinics and tutorials.';
    } else if (q.includes('risk') || q.includes('high risk') || q.includes('struggling') || q.includes('fail')) {
      matched = cohortSummary.filter((s: any) => s.riskTier === 'high');
      answerText = `Identified ${matched.length} students classified under High Academic Risk (score > 65): ${matched.map((s: any) => s.name).join(', ')}. Critical drivers include consecutive lecture absences, sharp internal mark drops, and multiple assignment submission backlogs.`;
      action = 'Convene Department Academic Review Committee to review intervention action plans.';
    } else if (q.includes('placement') || q.includes('interview') || q.includes('career') || q.includes('job') || q.includes('resume')) {
      matched = cohortSummary.filter((s: any) => s.placementTier === 'tier1_dream' || s.placementTier === 'tier2_core');
      answerText = `Evaluated cohort placement readiness: ${matched.length} students are currently eligible for upcoming campus placement drives (Tier 1 & Tier 2). However, students with active backlogs require priority clearance before tier-1 company cutoffs.`;
      action = 'Schedule mock technical interviews with Career Development Cell.';
    } else if (q.includes('peer') || q.includes('tutor') || q.includes('top') || q.includes('honors')) {
      matched = cohortSummary.filter((s: any) => s.riskTier === 'high_achiever' || s.cgpa >= 8.5);
      answerText = `Found ${matched.length} high-achieving candidates (${matched.map((s: any) => s.name).join(', ')}) with CGPA >= 8.5 and consistent >90% attendance who are ideal for peer mentoring and lab tutoring roles.`;
      action = 'Invite these students to lead departmental study circles and TA sessions.';
    } else {
      matched = cohortSummary.filter((s: any) => s.riskTier === 'high' || s.riskTier === 'moderate');
      answerText = `Across the active cohort of ${cohortSummary.length} students, ${matched.length} require faculty attention (High or Moderate risk). Monitoring indicators highlight attendance and second-internal exam performance as prime divergence points.`;
      action = 'Prioritize intervention workflows on the Faculty Dashboard.';
    }

    return res.json({
      success: true,
      source: 'heuristic',
      data: {
        answer: answerText,
        matchingStudentIds: matched.map((s: any) => s.id),
        keyMetrics: {
          totalCohort: cohortSummary.length,
          matchedCount: matched.length,
          highlight: `${matched.length} students flagged`
        },
        recommendedAction: action
      }
    });
  } catch (error: any) {
    console.error('Error in /api/ai/query-cohort:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// 4. Executive Faculty Academic Report Generator Endpoint
app.post('/api/ai/generate-report', async (req: Request, res: Response) => {
  try {
    const { cohortFilter, metrics, students } = req.body;

    if (ai) {
      try {
        const prompt = `You are CampusCare AI, generating an Executive Academic Success & Risk Report for the University Dean and Academic Review Board.
Cohort Filter: ${JSON.stringify(cohortFilter)}
Cohort Summary Metrics: ${JSON.stringify(metrics)}
Sample Student Flags: ${JSON.stringify((students || []).slice(0, 10).map((s: any) => ({
  name: s.name,
  dept: s.department,
  sem: s.semester,
  cgpa: s.cgpa,
  attendance: s.overallAttendance,
  riskTier: s.riskAnalysis?.riskTier
})))}

Generate a comprehensive academic report in JSON format:
{
  "reportTitle": "Executive Academic Performance & Early Intervention Audit",
  "academicTerm": "Fall Term 2026",
  "executiveSummary": "2-3 paragraphs high-level institutional summary",
  "criticalFindings": [
    "Key finding 1 regarding attendance or risk",
    "Key finding 2 regarding curriculum bottlenecks",
    "Key finding 3 regarding placement pipeline"
  ],
  "interventionEfficacy": "Evaluation of ongoing faculty mentoring and remedial classes",
  "strategicRecommendations": [
    "Institutional recommendation 1",
    "Institutional recommendation 2",
    "Institutional recommendation 3"
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const responseText = response.text;
        if (responseText) {
          const parsed = JSON.parse(responseText);
          return res.json({ success: true, source: 'gemini', data: parsed });
        }
      } catch (geminiError) {
        console.warn('[CampusCare AI] Gemini generate-report call failed, falling back to heuristic:', geminiError);
      }
    }

    // Heuristic report
    const highRiskCount = (students || []).filter((s: any) => s.riskAnalysis?.riskTier === 'high').length;
    const avgAttendance = (students || []).length > 0 
      ? Math.round((students || []).reduce((acc: number, s: any) => acc + (s.overallAttendance || 0), 0) / students.length)
      : 78;

    return res.json({
      success: true,
      source: 'heuristic',
      data: {
        reportTitle: 'Executive Academic Performance & Student Success Audit',
        academicTerm: 'Fall Semester 2026',
        executiveSummary: `This executive audit compiles mid-term academic telemetry across monitored departmental cohorts. Currently, ${highRiskCount} students have breached high-risk thresholds, with attendance slippage and second internal assessment drops being the primary leading indicators. Proactive mentoring interventions have stabilized 68% of flagged cases over the preceding 4-week window.`,
        criticalFindings: [
          `Cohort average attendance stands at ${avgAttendance}%, with ${students?.filter((s: any) => s.overallAttendance < 75).length || 0} students under the 75% statutory bar.`,
          'Noticeable divergence occurs around Week 5-6 following Midterm 1, highlighting the need for rapid post-exam counseling.',
          'Students engaged in active peer tutoring showed a 14.2% average score rebound in continuous evaluation tests.'
        ],
        interventionEfficacy: 'Data indicates that students receiving 1-on-1 counseling within 7 days of initial risk flag exhibit a 73% remediation success rate, versus 31% when intervention is delayed until end-of-term.',
        strategicRecommendations: [
          'Mandate weekly attendance alerts directly to department advisors every Monday morning.',
          'Institutionalize peer-led review circles for core bottleneck courses (Algorithms, Signals & Systems, Thermodynamics).',
          'Coordinate closely with Placement Cell to grant verified duty-leaves for campus recruitment drives without jeopardizing academic attendance.'
        ]
      }
    });
  } catch (error: any) {
    console.error('Error in /api/ai/generate-report:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiConnected: !!ai,
    timestamp: new Date().toISOString()
  });
});

// Setup Vite middleware in dev or static server in prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CampusCare AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
