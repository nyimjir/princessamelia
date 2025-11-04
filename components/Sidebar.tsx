import React, { useState, FormEvent, useCallback } from 'react';

const Sidebar: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [details, setDetails] = useState('');
    const [agreed, setAgreed] = useState(false);

    const handleRequest = useCallback((e: FormEvent) => {
      e.preventDefault();
      if (!agreed) {
        alert('Please confirm you agree to receive a reply.');
        return;
      }

      const to = 'princessamelia742@gmail.com';
      const body = `Name: ${name}\nReply-to email: ${email}\n\nDetails:\n${details}\n\n-- Sent from website request form`;
      const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}&cc=${encodeURIComponent(email)}`;

      window.location.href = mailto;
      alert('Your mail client should open to send the request. If it does not, please email princessamelia742@gmail.com directly.');
    }, [name, email, subject, details, agreed]);

    return (
        <aside id="request" className="bg-gradient-to-b from-white/[.02] to-white/[.01] rounded-2xl p-4.5 min-h-[240px]">
            <div className="flex items-center justify-between">
                <div>
                    <div className="font-bold text-white">Book a private request</div>
                    <div className="text-[#cfd8dc] text-sm mt-1">
                        Requests are delivered to email: <br />
                        <strong className="text-[#6ee7b7]">princessamelia742@gmail.com</strong>
                    </div>
                </div>
                <div className="text-right">
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://x.com/SierraJames111?t=R3AYdfDV4VGd-zJ1NsuRjA&s=09"
                        className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#0b1220] border border-white/[.03] cursor-pointer text-[#6ee7b7] font-semibold no-underline transition-colors hover:bg-[#101827]"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true" className="w-4 h-4 fill-current"><g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g></svg>
                        Visit my X
                    </a>
                </div>
            </div>

            <div id="contact" className="mt-4 p-3.5 bg-white/[.02] rounded-xl">
                <div className="font-bold text-white">Quick request</div>
                <div className="text-[#cfd8dc] text-sm">Fill this short form to request a custom video. The form uses your email client to send the request directly.</div>

                <form onSubmit={handleRequest} className="flex flex-col gap-2.5 mt-3">
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required className="bg-[#071417] border border-white/[.03] p-2.5 rounded-lg text-[#eaf6f0] focus:ring-2 focus:ring-[#6ee7b7] focus:outline-none" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email" required className="bg-[#071417] border border-white/[.03] p-2.5 rounded-lg text-[#eaf6f0] focus:ring-2 focus:ring-[#6ee7b7] focus:outline-none" />
                    <input type="text" value={subject} onChange={e => setSubject(e.target.value)} placeholder={'Subject (e.g. "Private yoga session")'} required className="bg-[#071417] border border-white/[.03] p-2.5 rounded-lg text-[#eaf6f0] focus:ring-2 focus:ring-[#6ee7b7] focus:outline-none" />
                    <textarea value={details} onChange={e => setDetails(e.target.value)} placeholder="Describe your request (length, style, privacy notes)" required className="bg-[#071417] border border-white/[.03] p-2.5 rounded-lg text-[#eaf6f0] resize-y min-h-[96px] focus:ring-2 focus:ring-[#6ee7b7] focus:outline-none"></textarea>
                    <label className="text-xs text-[#cfd8dc] flex items-center gap-2">
                        <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} required className="form-checkbox bg-[#071417] border-white/10 rounded text-[#6ee7b7] focus:ring-[#6ee7b7]" />
                        I confirm I will receive a reply at the email I provide.
                    </label>
                    <button type="submit" className="bg-gradient-to-r from-[#6ee7b7] to-[#6bb1ff] border-none text-[#042029] p-3 rounded-xl font-bold cursor-pointer transition-opacity hover:opacity-90">
                        Send request to email
                    </button>
                </form>

                <div className="text-xs text-[#cfd8dc] mt-2.5">
                    Or email directly: <a href="mailto:princessamelia742@gmail.com" className="text-[#6ee7b7] no-underline">princessamelia742@gmail.com</a>
                </div>
            </div>

            <div className="mt-3 text-[#cfd8dc] text-sm">
                Tip: If you'd like replies in Google Chat, include your Google Chat email/handle in the message details.
            </div>
        </aside>
    );
};

export default Sidebar;