import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Eyebrow } from "@/components/ui";
import { NomineeRegistrationForm } from "@/components/nominee-registration-form";

export default function RegisterPage() {
  return (
    <main className="auth-page">
      <div className="auth-layout auth-layout-register">
        <section className="auth-aside auth-aside-register">
          <span className="auth-aside-icon"><Sparkles size={22} /></span>
          <Eyebrow>NOMINEE REGISTRATION</Eyebrow>
          <h1>Put your work in the spotlight.</h1>
          <p>Register a nominee in an award category and share their story with voters.</p>
          <div className="register-perks">
            <span><i>01</i> Choose an award category</span>
            <span><i>02</i> Add nominee details and a photo</span>
            <span><i>03</i> Publish to the preview shortlist</span>
          </div>
        </section>
        <section className="auth-card">
          <Eyebrow>REGISTER A NOMINEE</Eyebrow>
          <h2>Nominee details</h2>
          <p className="auth-card-lede">Registration publishes the nominee immediately in this preview.</p>
          <NomineeRegistrationForm />
        </section>
      </div>
      <footer className="auth-footer"><span>Preview mode · details are saved only in this browser</span><Link href="/categories">Voter? Browse nominees <ArrowRight size={13} /></Link></footer>
    </main>
  );
}
