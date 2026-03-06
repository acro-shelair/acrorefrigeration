import Layout from "@/components/Layout";
import { termsContent } from "@/data/legal";

const TermsOfService = () => (
  <Layout>
    <div className="container-narrow section-padding">
      <h1 className="text-4xl font-extrabold mb-4">{termsContent.title}</h1>
      <p className="text-muted-foreground mb-8">Last updated: {termsContent.lastUpdated}</p>
      <div className="prose prose-lg max-w-none space-y-8 text-foreground/80">
        {termsContent.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-2xl font-bold text-foreground">{section.heading}</h2>
            <p>{section.body}</p>
            {section.body2 && <p>{section.body2}</p>}
            {section.list && (
              <ul className="list-disc pl-6 space-y-2">
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.contactDetails && (
              <ul className="list-none space-y-1">
                {section.contactDetails.map((cd) => (
                  <li key={cd.label}><strong>{cd.label}:</strong> {cd.value}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  </Layout>
);

export default TermsOfService;
