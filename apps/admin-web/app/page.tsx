interface ApiHealth {
  status: string;
  service: string;
  version: string;
  environment: string;
  timestamp: string;
}

async function getApiHealth(): Promise<ApiHealth | null> {
  const baseUrl = process.env.INTERNAL_API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1';
  try {
    const response = await fetch(`${baseUrl}/health`, {cache: 'no-store', signal: AbortSignal.timeout(2500)});
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as ApiHealth;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const health = await getApiHealth();
  return (
    <main className="page-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">MONOREPO FOUNDATION</p>
          <h1>StoreManagementApp</h1>
          <p className="subtitle">
            Nền tảng quản lý cửa hàng mobile-first, offline-first và multi-tenant.
          </p>
        </div>

        <div className={health ? 'status status-ok' : 'status status-warning'}>
          <span className="status-dot" aria-hidden="true"/>
          <div>
            <strong>{health ? 'API đang hoạt động' : 'API chưa kết nối'}</strong>
            <p>
              {health ? `${health.service} · ${health.environment} · ${health.version}` : 'Chạy npm run dev:api để kiểm tra kết nối.'}
            </p>
          </div>
        </div>
      </section>

      <section className="grid">
        <article className="panel">
          <span className="panel-number">01</span>
          <h2>Flutter Mobile</h2>
          <p>Ứng dụng Android cho gia đình, chuẩn bị cho local SQLite và đồng bộ offline.</p>
        </article>

        <article className="panel">
          <span className="panel-number">02</span>
          <h2>NestJS API</h2>
          <p>Biên nghiệp vụ tập trung cho tenancy, pricing, sales, inventory và AI.</p>
        </article>

        <article className="panel">
          <span className="panel-number">03</span>
          <h2>Supabase Platform</h2>
          <p>PostgreSQL, Auth, Realtime và Storage chạy local bằng Docker.</p>
        </article>
      </section>
    </main>
  );
}
