import "./TrustedClients.css";

const clientLogos = Array.from({ length: 12 }, (_, i) =>
  `${process.env.PUBLIC_URL}/client${i + 1}.png`
);

const scrollingLogos = [...clientLogos, ...clientLogos];

function TrustedClients() {
  return (
    <section className="serviceHub-clients">
      <h2>Trusted By Leading Clients</h2>
      <div className="logos-wrapper">
        <div className="client-logos">
          {scrollingLogos.map((logo, index) => (
            <div key={index} className="logo-box">
              <img src={logo} alt={`client-${index}`} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedClients;
