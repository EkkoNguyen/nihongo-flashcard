import { useQuery } from "@tanstack/react-query";
import { Activity, BookOpen, Layers3 } from "lucide-react";
import { getApiHealth } from "./api/health.js";

const navigation = [
  { label: "Tổng quan", active: true },
  { label: "Bộ thẻ của tôi" },
  { label: "Khám phá" },
  { label: "Lịch học" },
  { label: "Thống kê" },
];

export default function App() {
  const health = useQuery({ queryKey: ["api-health"], queryFn: getApiHealth });

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Điều hướng chính">
        <a className="brand" href="/" aria-label="Kotoba Loop, trang chủ">
          <span className="brand-mark" aria-hidden="true">
            ∞
          </span>
          <span>Kotoba Loop</span>
        </a>
        <nav className="nav-list">
          {navigation.map(({ label, active }) => (
            <a
              className={`nav-item${active ? " active" : ""}`}
              href="#"
              key={label}
            >
              <span className="nav-dot" aria-hidden="true" />
              {label}
            </a>
          ))}
        </nav>
        <div className="sidebar-footer">
          <Activity size={16} aria-hidden="true" />
          <span>Trạng thái API</span>
          <span
            className={`status-dot ${health.isSuccess ? "online" : "offline"}`}
          />
          <span className="sr-only">
            {health.isSuccess ? "Đang hoạt động" : "Chưa kết nối"}
          </span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Kotoba Loop</p>
            <h1>Chào mừng bạn đến với hành trình tiếng Nhật</h1>
          </div>
          <div className="avatar" aria-label="Tài khoản người học">
            学
          </div>
        </header>

        <section className="welcome-panel" aria-labelledby="welcome-title">
          <div>
            <p className="eyebrow">Mỗi ngày một chút</p>
            <h2 id="welcome-title">Học theo nhịp của bạn.</h2>
            <p className="welcome-copy">
              Tạo bộ thẻ riêng, chọn cách ôn tập phù hợp và duy trì tiến độ từng
              ngày.
            </p>
          </div>
          <div className="welcome-art" aria-hidden="true">
            <span className="art-kanji">学</span>
            <span className="art-spark">✦</span>
          </div>
        </section>

        <section className="starter-grid" aria-label="Bước khởi đầu">
          <article className="starter-item">
            <div className="starter-icon cobalt">
              <Layers3 size={20} aria-hidden="true" />
            </div>
            <div>
              <h3>Tạo bộ thẻ đầu tiên</h3>
              <p>Nhóm từ vựng, kanji hoặc ngữ pháp theo cách bạn học.</p>
            </div>
          </article>
          <article className="starter-item">
            <div className="starter-icon teal">
              <BookOpen size={20} aria-hidden="true" />
            </div>
            <div>
              <h3>Chọn chế độ ôn tập</h3>
              <p>Mỗi phiên học tập trung vào bộ thẻ bạn đã mở.</p>
            </div>
          </article>
        </section>

        <footer className="connection-note" role="status">
          {health.isLoading && "Đang kiểm tra kết nối API…"}
          {health.isSuccess && "API đã kết nối. Nền tảng khởi động sẵn sàng."}
          {health.isError &&
            "Chưa kết nối được API. Hãy chạy pnpm dev để khởi động ứng dụng."}
        </footer>
      </main>
    </div>
  );
}
