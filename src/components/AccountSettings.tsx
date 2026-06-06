"use client";

import { useState } from "react";
import type { Content, LanguageCode } from "@/data/content";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { updateProfile, type ProfileRow } from "@/lib/data";

// Account settings modal: edit details, change password, delete account, log out.
export default function AccountSettings({
  c,
  profile,
  languages,
  onClose,
  onUpdated,
}: {
  c: Content;
  profile: ProfileRow;
  languages: { code: LanguageCode; label: string }[];
  onClose: () => void;
  onUpdated: (patch: Partial<ProfileRow>) => void;
}) {
  const ac = c.account;
  const sb = getSupabaseBrowserClient();
  const [name, setName] = useState(profile.display_name ?? "");
  const [role, setRole] = useState(profile.role);
  const [language, setLanguage] = useState<string>(profile.language);
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const saveDetails = async () => {
    setBusy(true);
    setMsg(null);
    await updateProfile(profile.id, { display_name: name.trim(), role: role.trim(), language });
    onUpdated({ display_name: name.trim(), role: role.trim(), language });
    setMsg(ac.saved);
    setBusy(false);
  };

  const changePassword = async () => {
    if (!pw) return;
    setBusy(true);
    setMsg(null);
    const { error } = await sb.auth.updateUser({ password: pw });
    setMsg(error ? error.message : ac.passwordUpdated);
    setPw("");
    setBusy(false);
  };

  const deleteAccount = async () => {
    if (confirm !== ac.confirmWord) return;
    setBusy(true);
    setMsg(null);
    const { error } = await sb.functions.invoke("delete-account", { method: "POST" });
    if (error) {
      setMsg(error.message);
      setBusy(false);
      return;
    }
    await sb.auth.signOut(); // onAuthStateChange in page.tsx routes back to auth
  };

  const logout = async () => {
    await sb.auth.signOut();
  };

  return (
    <div className="modal-scrim" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{ac.title}</h3>
          <button className="linkbtn" onClick={onClose}>
            {ac.close}
          </button>
        </div>

        <label className="fld-label">{ac.nameLabel}</label>
        <input className="field" value={name} onChange={(e) => setName(e.target.value)} />
        <label className="fld-label">{ac.roleLabel}</label>
        <input className="field" value={role} onChange={(e) => setRole(e.target.value)} />
        <label className="fld-label">{ac.languageLabel}</label>
        <select className="field" value={language} onChange={(e) => setLanguage(e.target.value)}>
          {languages.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
        <button className="btn btn-pri" disabled={busy} onClick={() => void saveDetails()}>
          {ac.save}
        </button>

        <hr className="modal-sep" />
        <h4 className="modal-sub">{ac.passwordTitle}</h4>
        <input
          className="field"
          type="password"
          autoComplete="new-password"
          placeholder={ac.newPassword}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
        <button className="btn btn-soft" disabled={busy || !pw} onClick={() => void changePassword()}>
          {ac.updatePassword}
        </button>

        <hr className="modal-sep" />
        <button className="btn btn-soft" onClick={() => void logout()}>
          {ac.signOut}
        </button>

        <hr className="modal-sep" />
        <h4 className="modal-sub danger">{ac.dangerTitle}</h4>
        <p className="modal-danger-desc">{ac.dangerDesc}</p>
        <input
          className="field"
          placeholder={ac.confirmHint}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button
          className="btn btn-danger"
          disabled={busy || confirm !== ac.confirmWord}
          onClick={() => void deleteAccount()}
        >
          {busy ? ac.deleting : ac.deleteCta}
        </button>

        {msg && <p className="dummy-msg">{msg}</p>}
      </div>
    </div>
  );
}
