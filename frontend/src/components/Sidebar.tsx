import { NavLink } from "react-router-dom";

const menu = [
  {
    label: "Dashboard",
    to: "/",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" /></svg>
    ),
  },
  {
    label: "Assets",
    to: "/assets",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M16 3v4M8 3v4" /></svg>
    ),
  },
  {
    label: "Upload",
    to: "/upload",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0l-4 4m4-4l4 4M4 20h16" /></svg>
    ),
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-white border-r flex flex-col p-4">
      <div className="flex items-center gap-2 mb-8 border-b pb-4">
        <span className="font-bold text-xl text-gray-900">AssetHub</span>
      </div>
      <nav className="flex-1 flex flex-col gap-2">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition ${isActive ? "bg-gray-100 font-semibold" : ""}`
            }
            end={item.to === "/"}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
