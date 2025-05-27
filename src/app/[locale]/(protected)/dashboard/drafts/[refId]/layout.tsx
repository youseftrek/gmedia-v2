import "../../[serviceId]/_components/styles/formio.full.min.css";
import "../../[serviceId]/_components/styles/formio-bootstrap.css";

export default function BootstrapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="bootstrap-container">{children}</div>;
}
