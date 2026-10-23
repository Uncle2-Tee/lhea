"use client";

import { ArrowRight, ImagePlus, Mail, Phone, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { useDemoState } from "@/components/demo-provider";
import { categories } from "@/lib/election-data";

const MAX_PHOTO_SIZE = 1024 * 1024;

function readPhoto(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("The selected photo could not be read."));
    });
    reader.addEventListener("error", () => reject(new Error("The selected photo could not be read.")));
    reader.readAsDataURL(file);
  });
}

export function NomineeRegistrationForm() {
  const router = useRouter();
  const { state, ready, registerNominee, error } = useDemoState();
  const [formError, setFormError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const categoryId = String(form.get("category") || "");
    const email = String(form.get("email") || "").trim().toLowerCase();
    const phone = String(form.get("phone") || "").trim();
    const bio = String(form.get("bio") || "").trim();
    const photo = form.get("photo");

    if (name.length < 2 || !categories.some((category) => category.id === categoryId) ||
      !email.includes("@") || phone.length < 7 || bio.length < 20) {
      setFormError("Complete each field with valid nominee details. The bio must be at least 20 characters.");
      return;
    }
    if (!(photo instanceof File) || photo.size === 0 || !photo.type.startsWith("image/")) {
      setFormError("Choose an image for the nominee profile.");
      return;
    }
    if (photo.size > MAX_PHOTO_SIZE) {
      setFormError("The photo must be 1 MB or smaller for this browser preview.");
      return;
    }
    if (!ready) {
      setFormError("Registration data is still loading. Please try again.");
      return;
    }
    if (state.registeredNominees.some((nominee) => nominee.email === email)) {
      setFormError("A nominee has already registered with this email address in this browser.");
      return;
    }

    try {
      const category = categories.find((item) => item.id === categoryId);
      if (!category) {
        setFormError("Select a valid award category.");
        return;
      }

      const nominee = {
        name,
        categoryId,
        email,
        phone,
        bio,
        photoDataUrl: await readPhoto(photo),
      };
      const nomineeId = await registerNominee(nominee);
      if (nomineeId) router.push(`/nominees/${nomineeId}`);
    } catch (registrationError) {
      setFormError(registrationError instanceof Error
        ? registrationError.message
        : "The nominee photo could not be saved.");
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span>Nominee name</span>
        <span className="field-control"><UserRound size={17} /><input name="name" autoComplete="name" placeholder="Full name or group name" required minLength={2} /></span>
      </label>
      <label className="field">
        <span>Award category</span>
        <select name="category" required defaultValue="">
          <option value="" disabled>Select a category</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Email address</span>
        <span className="field-control"><Mail size={17} /><input name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></span>
      </label>
      <label className="field">
        <span>Phone number</span>
        <span className="field-control"><Phone size={17} /><input name="phone" type="tel" autoComplete="tel" placeholder="+233 24 000 0000" required minLength={7} /></span>
      </label>
      <label className="field">
        <span>Biography</span>
        <textarea name="bio" rows={4} minLength={20} placeholder="Tell voters about the nominee (at least 20 characters)." required />
      </label>
      <label className="field">
        <span>Profile photo</span>
        <span className="field-control"><ImagePlus size={17} /><input name="photo" type="file" accept="image/jpeg,image/png,image/webp,image/gif" required /></span>
        <small>JPEG, PNG, WebP, or GIF image, up to 1 MB.</small>
      </label>
      <p className="form-note">Submitting stores this nominee in your private browser session. Contact details are not shown on the profile.</p>
      {formError || error ? <p className="form-error" role="alert">{formError || error}</p> : null}
      <button className="button button-primary button-full" type="submit" disabled={!ready}>
        Register nominee <ArrowRight size={16} />
      </button>
    </form>
  );
}
