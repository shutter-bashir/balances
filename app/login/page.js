export const metadata = {
  title: "Sign in · Wallet",
};

const css = `
  .login{min-height:100dvh;display:flex;align-items:center;justify-content:center;padding:24px 16px;box-sizing:border-box;
    background:radial-gradient(80% 50% at 50% 30%,rgba(236,100,39,.18),rgba(0,0,0,0) 70%),#000;color:#fff;
    font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif}
  .login form{width:100%;max-width:340px;display:flex;flex-direction:column;gap:14px}
  .login h1{margin:0;font-size:30px;font-weight:600;letter-spacing:-.02em}
  .login p{margin:0 0 6px;color:rgba(255,255,255,.64);font-size:15px}
  .login input{box-sizing:border-box;width:100%;height:52px;padding:0 16px;border-radius:16px;border:1px solid rgba(255,255,255,.18);
    background:rgba(255,255,255,.08);color:#fff;font:inherit;font-size:17px;outline:none}
  .login input:focus{border-color:#ec6427;box-shadow:0 0 0 3px rgba(236,100,39,.3)}
  .login button{height:52px;border:0;border-radius:26px;background:linear-gradient(180deg,#ff7a45,#ff3b2a);color:#fff;
    font:inherit;font-size:17px;font-weight:600;cursor:pointer}
  .login button:focus-visible{outline:2px solid #fff;outline-offset:3px}
  .login .err{color:#ff9a85;font-size:14px;margin:0}
`;

export default async function Login({ searchParams }) {
  const { error } = await searchParams;

  return (
    <main className="login">
      <style>{css}</style>
      <form method="post" action="/api/login">
        <h1>Wallet</h1>
        <p>Enter your password to open your wallet.</p>
        <input
          type="password"
          name="password"
          aria-label="Password"
          placeholder="Password"
          autoComplete="current-password"
          autoFocus
          required
        />
        {error ? (
          <p className="err" role="alert">
            That password didn't match. Try again.
          </p>
        ) : null}
        <button type="submit">Open wallet</button>
      </form>
    </main>
  );
}
