'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

type Project = {
  id: string;
  name: string;
  environments: { name: string; baseUrl: string }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        await apiFetch('/auth/me');
        const data = await apiFetch('/projects');
        setProjects(data);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  if (loading) return <main style={{ padding: 40 }}>Loading...</main>;

  return (
    <main style={{ maxWidth: 720, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1>Projects</h1>
        <a
          href="/projects/new"
          style={{
            padding: '8px 16px',
            background: '#111',
            color: '#fff',
            borderRadius: 6,
            textDecoration: 'none',
          }}
        >
          + New Project
        </a>
      </div>
      {projects.length === 0 && <p>No projects yet. Create your first one.</p>}
      <div>
        {projects.map((p) => (
          <div
            key={p.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: 8,
              padding: 16,
              marginTop: 12,
            }}
          >
            <strong>{p.name}</strong>
            <div style={{ color: '#666', fontSize: 14 }}>
              {p.environments[0]?.name}: {p.environments[0]?.baseUrl}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
