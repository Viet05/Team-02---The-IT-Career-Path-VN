const USERS_KEY = "mock_users";

const makeFakeJwt = (payload) => {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.fake`;
};

const loadUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export async function registerMock({ email, password, role, fullName }) {
  await new Promise((r) => setTimeout(r, 250));

  if (!email?.trim()) throw new Error("Vui lòng nhập email.");
  if (!password?.trim()) throw new Error("Vui lòng nhập mật khẩu.");
  if (password.length < 6) throw new Error("Mật khẩu tối thiểu 6 ký tự.");
  if (!role) throw new Error("Vui lòng chọn role.");
  if (!["Student", "Company"].includes(role)) throw new Error("Role không hợp lệ.");

  const users = loadUsers();
  const key = email.trim().toLowerCase();

  if (users[key]) throw new Error("Email đã tồn tại.");

  users[key] = { email: key, password, role, fullName: fullName || "" };
  saveUsers(users);

  return { ok: true };
}
  
export async function loginMock({ email, password }) {
  await new Promise((r) => setTimeout(r, 250));

  if (!email?.trim() || !password?.trim()) {
    throw new Error("Vui lòng nhập email và mật khẩu.");
  }

  const e = email.trim().toLowerCase();

  // ✅ ADMIN HARDCODE
  if (e === "admin" && password === "admin") {
    return {
      token: makeFakeJwt({ sub: "admin", role: "Admin", exp: Date.now() + 60 * 60 * 1000 }),
      role: "Admin",
    };
  }

  const users = loadUsers();
  const user = users[e];

  if (!user) throw new Error("Tài khoản không tồn tại. Vui lòng đăng ký.");
  if (user.password !== password) throw new Error("Sai mật khẩu.");

  return {
    token: makeFakeJwt({ sub: user.email, role: user.role, exp: Date.now() + 60 * 60 * 1000 }),
    role: user.role, // Student | Company
  };
}
