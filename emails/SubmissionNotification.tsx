import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Hr,
  Preview,
  Section,
} from "@react-email/components"

interface SubmissionNotificationProps {
  type: "tool" | "startup"
  name: string
  fields: { label: string; value: string }[]
  submitterEmail: string
}

export function SubmissionNotification({
  type = "tool",
  name = "Example",
  fields = [],
  submitterEmail = "submitter@example.com",
}: SubmissionNotificationProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>
        New {type} submission: {name}
      </Preview>
      <Body style={body}>
        <Container style={card}>
          <Text style={heading}>
            New {type} submission
          </Text>
          <Text style={paragraph}>
            <strong>{name}</strong> was submitted for review.
          </Text>

          <Section style={fieldsSection}>
            {fields.map((field, i) => (
              <Text key={i} style={fieldRow}>
                <span style={fieldLabel}>{field.label}:</span>{" "}
                {field.value}
              </Text>
            ))}
          </Section>

          <Hr style={divider} />

          <Text style={footer}>
            Submitted by {submitterEmail}. Review it in Notion and set Published
            to true when ready.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default SubmissionNotification

// ---------------------------------------------------------------------------
// Inline styles (required for email clients)
// ---------------------------------------------------------------------------

const body: React.CSSProperties = {
  backgroundColor: "#faf9f6",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  padding: "40px 0",
  margin: 0,
}

const card: React.CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: "560px",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "8px",
}

const heading: React.CSSProperties = {
  color: "#18181b",
  fontSize: "24px",
  fontWeight: 600,
  lineHeight: 1.3,
  margin: "0 0 16px",
}

const paragraph: React.CSSProperties = {
  color: "#71717a",
  fontSize: "16px",
  lineHeight: 1.6,
  margin: "0 0 24px",
}

const fieldsSection: React.CSSProperties = {
  backgroundColor: "#faf9f6",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "0 0 8px",
}

const fieldRow: React.CSSProperties = {
  color: "#3f3f46",
  fontSize: "14px",
  lineHeight: 1.6,
  margin: "0 0 6px",
}

const fieldLabel: React.CSSProperties = {
  color: "#71717a",
  fontWeight: 600,
}

const divider: React.CSSProperties = {
  borderColor: "#e4e4e7",
  margin: "24px 0 20px",
}

const footer: React.CSSProperties = {
  color: "#a1a1aa",
  fontSize: "13px",
  lineHeight: 1.5,
  margin: 0,
}
