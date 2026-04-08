import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Hr,
  Preview,
} from "@react-email/components"

interface WelcomeEmailProps {
  unsubscribeUrl?: string
}

export function WelcomeEmail({
  unsubscribeUrl = "https://founderstackafrica.com",
}: WelcomeEmailProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>The tools, flows, and resources every African founder needs.</Preview>
      <Body style={body}>
        <Container style={card}>
          <Text style={heading}>Welcome to FounderStack Africa</Text>
          <Text style={paragraph}>
            You&apos;ll hear from us when we add new tools, publish new founder
            guides, or spot something worth knowing about building a startup in
            Africa.
          </Text>
          <Button style={button} href="https://founderstackafrica.com">
            Browse the stack
          </Button>
          <Hr style={divider} />
          <Text style={footer}>
            You subscribed at founderstackafrica.com.{" "}
            <a href={unsubscribeUrl} style={footerLink}>
              Unsubscribe
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default WelcomeEmail

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

const button: React.CSSProperties = {
  backgroundColor: "#18181b",
  color: "#fafafa",
  fontSize: "14px",
  fontWeight: 600,
  borderRadius: "8px",
  padding: "12px 24px",
  textDecoration: "none",
  display: "inline-block",
}

const divider: React.CSSProperties = {
  borderColor: "#e4e4e7",
  margin: "32px 0 24px",
}

const footer: React.CSSProperties = {
  color: "#a1a1aa",
  fontSize: "13px",
  lineHeight: 1.5,
  margin: 0,
}

const footerLink: React.CSSProperties = {
  color: "#a1a1aa",
  textDecoration: "underline",
}
