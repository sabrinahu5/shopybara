export default function Privacy() {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12">
        <article className="space-y-8">
          <header>
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-sm text-gray-500">Last Updated: February 15, 2025</p>
          </header>
  
          <div className="space-y-6 text-gray-600 dark:text-gray-300">
            <p>
              Welcome to Shopybara. We respect your privacy and are committed to protecting your personal information.
            </p>
  
            <section>
              <h2 className="text-xl font-semibold mb-2">What We Collect</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Pinterest board data when you connect your account</li>
                <li>Basic account information (email, name)</li>
                <li>App usage data to improve your experience</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-xl font-semibold mb-2">How We Use It</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Generate personalized shopping recommendations</li>
                <li>Maintain your account</li>
                <li>Improve our service</li>
              </ul>
            </section>
  
            <section>
              <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
              <p>
                You can access, modify, or delete your data at any time. Contact{' '}
                <a href="mailto:privacy@shopybara.com" className="text-teal-600 hover:text-teal-700">
                  privacy@shopybara.com
                </a>
                {' '}for help.
              </p>
            </section>
  
            <section>
              <h2 className="text-xl font-semibold mb-2">Important Notes</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>We use industry-standard security measures</li>
                <li>We don't sell your personal information</li>
                <li>Our service is not intended for users under 13</li>
              </ul>
            </section>
          </div>
        </article>
      </main>
    );
  }