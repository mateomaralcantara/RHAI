// pages/agendar.tsx
import Layout from '../components/Layout';
// Asegúrate de que esta línea sea correcta, ya que renombraste el archivo.
import ContactForm from '../components/ContactForm.jsx'; // <--- CAMBIO AQUÍ

export default function AgendarPage() {
  return (
    <Layout title="Contacto | RHAI" description="Envía tus datos a RHAI.">
      <div className="py-16 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <ContactForm /> {/* <--- Y AQUÍ para usar el nombre del componente */}
        </div>
      </div>
    </Layout>
  );
}