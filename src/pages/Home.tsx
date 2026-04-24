import { useAsync } from "../hooks/useAsync";
import { api } from "../lib/api";
import HeroCarousel from "../components/HeroCarousel";
import SectionHeader from "../components/SectionHeader";
import AnimeGrid, { AnimeGridSkeleton } from "../components/AnimeGrid";
import ErrorState from "../components/ErrorState";

export default function HomePage() {
  const top = useAsync(() => api.topAnime(1), []);
  const airing = useAsync(() => api.topAnime(1, "airing"), []);
  const season = useAsync(() => api.seasonNow(1), []);
  const upcoming = useAsync(() => api.seasonUpcoming(1), []);

  return (
    <div className="container-page space-y-12 py-6">
      {top.loading ? (
        <div className="h-[420px] md:h-[520px] skeleton rounded-3xl" />
      ) : top.error ? (
        <ErrorState onRetry={top.reload} />
      ) : (
        <HeroCarousel items={top.data?.data ?? []} />
      )}

      <section>
        <SectionHeader
          title="Top Anime"
          subtitle="Highest-rated anime of all time"
          to="/top"
        />
        {top.loading ? (
          <AnimeGridSkeleton />
        ) : top.error ? (
          <ErrorState onRetry={top.reload} />
        ) : (
          <AnimeGrid items={(top.data?.data ?? []).slice(0, 12)} startRank={1} />
        )}
      </section>

      <section>
        <SectionHeader
          title="Currently Airing"
          subtitle="What's running on TV right now"
          to="/search?status=airing&order_by=popularity"
        />
        {airing.loading ? (
          <AnimeGridSkeleton />
        ) : airing.error ? (
          <ErrorState onRetry={airing.reload} />
        ) : (
          <AnimeGrid items={(airing.data?.data ?? []).slice(0, 12)} />
        )}
      </section>

      <section>
        <SectionHeader
          title="This Season"
          subtitle="The hottest titles of the current season"
          to="/seasonal"
        />
        {season.loading ? (
          <AnimeGridSkeleton />
        ) : season.error ? (
          <ErrorState onRetry={season.reload} />
        ) : (
          <AnimeGrid items={(season.data?.data ?? []).slice(0, 12)} />
        )}
      </section>

      <section>
        <SectionHeader
          title="Upcoming"
          subtitle="Coming to a screen near you"
          to="/seasonal?tab=upcoming"
        />
        {upcoming.loading ? (
          <AnimeGridSkeleton />
        ) : upcoming.error ? (
          <ErrorState onRetry={upcoming.reload} />
        ) : (
          <AnimeGrid items={(upcoming.data?.data ?? []).slice(0, 12)} />
        )}
      </section>
    </div>
  );
}
