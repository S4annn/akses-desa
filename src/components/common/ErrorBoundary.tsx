import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="grid min-h-screen place-items-center bg-mist px-6">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-rose-50 text-rose-600">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-slate-900">Terjadi kesalahan</h1>
          <p className="mt-2 text-slate-600">
            Maaf, ada bagian dari halaman yang tidak dapat dimuat. Silakan coba muat ulang halaman atau kembali ke beranda.
          </p>
          {this.state.error && (
            <details className="mt-4 rounded-xl border border-slate-200 bg-white p-3 text-left text-xs text-slate-500">
              <summary className="cursor-pointer font-medium">Detail teknis</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words">{this.state.error.message}</pre>
            </details>
          )}
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => window.location.reload()} className="btn-primary">
              <RefreshCw className="h-4 w-4" /> Muat Ulang
            </button>
            <a href="/" className="btn-outline">
              <Home className="h-4 w-4" /> Ke Beranda
            </a>
          </div>
        </div>
      </div>
    );
  }
}
