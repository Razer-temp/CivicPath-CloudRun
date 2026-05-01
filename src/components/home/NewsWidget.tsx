import { Newspaper, ExternalLink } from "lucide-react";
import { NewsItem } from "../../types";

export const NewsWidget = ({ t, news, loadingNews }: { t: (key: string) => string, news: NewsItem[], loadingNews: boolean }) => {
  return (
    <section className="w-full bg-slate-50 border-b border-slate-200 py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-100 text-civic-blue rounded-xl flex items-center justify-center">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">{t("Live Election News")}</h2>
            <p className="text-slate-500 text-sm">{t("Real-time updates to keep you informed")}</p>
          </div>
        </div>

        {loadingNews ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse h-40" />
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {news.map((item, idx) => (
              <a 
                key={idx} 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 line-clamp-3 group-hover:text-civic-blue transition-colors">
                    {item.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between mt-4 border-t border-slate-50 pt-4">
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(item.pubDate.replace(' ', 'T')).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 bg-white rounded-2xl border border-slate-100">
            {t("Check back later for live updates.")}
          </div>
        )}
      </div>
    </section>
  );
};
