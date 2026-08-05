"""
AI Assistant API view.

Provides a simple conversational endpoint for the HR & Payroll AI assistant.
In production, swap the _generate_reply helper for a real LLM call.
"""
import re
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status


# ---------------------------------------------------------------------------
# Simple rule-based reply generator (placeholder for a real LLM)
# ---------------------------------------------------------------------------

_FAQ: list[tuple[re.Pattern, str]] = [
    (re.compile(r"payroll|payslip|salary|pay run", re.I),
     "You can manage payroll runs under **Payroll → Overview**. "
     "Generate a run, review each employee's payslip, then submit for approval."),
    (re.compile(r"leave|time off|holiday|vacation|absence", re.I),
     "Employees can apply for leave under **Self-Service → Leave**. "
     "Managers approve requests from **Leave Workflow**, and HR can see all requests in **Leave Approvals**."),
    (re.compile(r"attendance|check.?in|check.?out|clock", re.I),
     "Attendance is tracked under **Attendance Management**. "
     "Employees check in and out via the self-service portal. Correction requests can be submitted if there is a discrepancy."),
    (re.compile(r"contract|employment", re.I),
     "Employment contracts live under **Contract Management**. "
     "You can create, renew, or terminate contracts from there."),
    (re.compile(r"perform|review|goal|kpi|rating", re.I),
     "Performance cycles, goals, and reviews are managed under **Performance Oversight**. "
     "Employees set goals, managers conduct reviews, and HR finalises calibration."),
    (re.compile(r"benefit|insurance|pension|enroll", re.I),
     "Benefits are configured under each employee record. "
     "Open an employee profile and navigate to the Benefits tab."),
    (re.compile(r"report|analytic|dashboard|metric|kpi", re.I),
     "Comprehensive reports and dashboards are available under **Reports & Analytics**. "
     "You can filter by branch, department, or date range."),
    (re.compile(r"employee|staff|hire|onboard|lifecycle", re.I),
     "Employee records are under **Employee Lifecycle**. "
     "You can manage personal details, documents, education, work experience, and more."),
    (re.compile(r"hello|hi|hey|help|what can you", re.I),
     "Hello! I'm the Nexus HR assistant. I can help with payroll, leave, attendance, "
     "contracts, performance, benefits, and reports. What do you need?"),
]

_DEFAULT_REPLY = (
    "I'm not sure I have a specific answer for that right now. "
    "You can explore the relevant module in the sidebar, or contact your HR administrator for assistance."
)


def _generate_reply(message: str) -> str:
    for pattern, reply in _FAQ:
        if pattern.search(message):
            return reply
    return _DEFAULT_REPLY


# ---------------------------------------------------------------------------
# View
# ---------------------------------------------------------------------------

class AIChatView(APIView):
    """
    POST /api/ai/chat/
    Body: { "message": "<user text>", "history": [{"role": "user"|"assistant", "content": "..."}] }
    Returns: { "reply": "<assistant text>", "timestamp": "<iso>" }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        message = (request.data.get("message") or "").strip()
        if not message:
            return Response(
                {"detail": "message is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        reply = _generate_reply(message)
        return Response({
            "reply": reply,
            "timestamp": timezone.now().isoformat(),
        })
