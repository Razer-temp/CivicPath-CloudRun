import { logger } from "../../utils/logger";
import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  errorType: "quota" | "rate_limit" | "other" | null;
}

export class QuotaErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorType: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Determine error type based on message
    const msg = error.message.toLowerCase();

    if (msg.includes("quota exceeded") || msg.includes("firebase") || msg.includes("too many requests") || msg.includes("429")) {
      return {
        hasError: true,
        errorType: msg.includes("429") ? "rate_limit" : "quota"
      };
    }

    return { hasError: true, errorType: "other" };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.warn("Uncaught error caught by QuotaErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-orange-50 border border-orange-200 rounded-2xl max-w-md mx-auto text-center mt-10">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {this.state.errorType === "rate_limit"
              ? "High Traffic Alert"
              : "System Taking a Break"}
          </h2>
          <p className="text-slate-600 mb-6 font-medium leading-relaxed">
            {this.state.errorType === "rate_limit"
              ? "CivicBot is currently helping many users and taking a breather. Please try again."
              : "We're experiencing heavy load right now. We've switched to offline mode where possible."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, errorType: null });
              if (this.props.onRetry) this.props.onRetry();
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
