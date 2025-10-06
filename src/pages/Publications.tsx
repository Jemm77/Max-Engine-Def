import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PublicationCard } from "@/components/PublicationCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Publication {
  // Normalized fields from different tables
  title: string | null;
  authors?: string | null;
  authors_processed?: string[] | null;
  summary?: string | null;
  synthesized?: string | null;
  url?: string | null;
  source: "sergiobarajas" | "OpeDataScienceExtraction" | string;
  releaseDate?: string | null;
  publications?: string | null;
}

export const Publications = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [displayedPubs, setDisplayedPubs] = useState<Publication[]>([]);
  const [filteredPubs, setFilteredPubs] = useState<Publication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const ITEMS_PER_PAGE = 20;

  const [sourceFilter, setSourceFilter] = useState<"all" | "sergiobarajas" | "OpeDataScienceExtraction">("all");

  useEffect(() => {
    fetchPublications();
  }, []);

  useEffect(() => {
    filterPublications();
  }, [searchTerm, publications]);

  // re-filter when source changes
  useEffect(() => {
    filterPublications();
  }, [sourceFilter]);

  useEffect(() => {
    setPage(0);
    setDisplayedPubs([]);
    setHasMore(true);
    loadMorePublications(0);
  }, [filteredPubs]);

  const fetchPublications = async () => {
    setLoading(true);

    // Fetch sergiobarajas
    const [{ data: sergioData, error: sergioError }, { data: opeData, error: opeError }] = await Promise.all([
      supabase.from("sergiobarajas").select("*") as any,
      supabase.from("OpeDataScienceExtraction").select("*") as any,
    ]);

    if (sergioError || opeError) {
      toast({
        title: "Error fetching publications",
        description: (sergioError || opeError)?.message || "Unknown error",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    // Normalize rows from both tables into Publication[]
    const normalized: Publication[] = [];

    if (Array.isArray(sergioData)) {
      sergioData.forEach((r: any) => {
        normalized.push({
          title: r.Titulo ?? null,
          authors: r.Autores ?? null,
          authors_processed: r.autores_procesados ?? null,
          summary: r.Resumen ?? null,
          synthesized: r.resumen_sintetizado ?? null,
          url: r.Page_URL ?? null,
          source: "sergiobarajas",
        });
      });
    }

    if (Array.isArray(opeData)) {
      opeData.forEach((r: any) => {
        normalized.push({
          title: r.Title ?? r.Titulo ?? null,
          authors: null,
          authors_processed: null,
          summary: r.Text ?? r.Description ?? r.Descripcion ?? null,
          synthesized: r.resumen_sintetizado ?? null,
          url: r.Title_URL ?? null,
          releaseDate: r.ReleaseDate ?? null,
          publications: r.Publications ?? null,
          source: "OpeDataScienceExtraction",
        });
      });
    }

    setPublications(normalized);
    setLoading(false);
  };

  const loadMorePublications = (targetPage: number) => {
    if (loadingMore) return;

    setLoadingMore(true);
    
    const start = targetPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const newPubs = filteredPubs.slice(start, end);

    if (newPubs.length === 0) {
      setHasMore(false);
    } else {
      if (targetPage === 0) {
        setDisplayedPubs(newPubs);
      } else {
        setDisplayedPubs((prev) => [...prev, ...newPubs]);
      }
      
      if (end >= filteredPubs.length) {
        setHasMore(false);
      }
      
      setPage(targetPage);
    }
    
    setLoadingMore(false);
  };

  const filterPublications = () => {
    let filtered = publications;

    // Apply source filter
    if (sourceFilter !== "all") {
      filtered = filtered.filter((p) => p.source === sourceFilter);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((pub) => {
        return (
          (pub.title || "").toLowerCase().includes(q) ||
          (pub.synthesized || "").toLowerCase().includes(q) ||
          (pub.summary || "").toLowerCase().includes(q) ||
          (pub.authors_processed || []).some((a) => a.toLowerCase().includes(q)) ||
          (pub.authors || "").toLowerCase().includes(q)
        );
      });
    }

    setFilteredPubs(filtered);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Research Articles</h1>
        <p className="text-muted-foreground">
          AI-processed scientific research articles with synthesized summaries
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search publications..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-card border-border"
        />
      </div>

      {/* Source Filter */}
      <div className="mt-3 flex items-center gap-3">
        <label className="text-sm text-muted-foreground">Source:</label>
        <div className="flex gap-2">
          <Button size="sm" variant={sourceFilter === "all" ? undefined : "ghost"} onClick={() => setSourceFilter("all")}>All</Button>
          <Button size="sm" variant={sourceFilter === "sergiobarajas" ? undefined : "ghost"} onClick={() => setSourceFilter("sergiobarajas")}>Space Biology Publications</Button>
          <Button size="sm" variant={sourceFilter === "OpeDataScienceExtraction" ? undefined : "ghost"} onClick={() => setSourceFilter("OpeDataScienceExtraction")}>Biological Data Project</Button>
        </div>
      </div>

      {/* Publications Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-card/50 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            Showing {displayedPubs.length} of {filteredPubs.length} publications
            {filteredPubs.length !== publications.length && ` (${publications.length} total)`}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPubs.map((pub, index) => (
              <PublicationCard
                key={index}
                id={`${pub.source}-${index}`}
                title={pub.title || "Untitled"}
                description={pub.synthesized || pub.summary || 'No description available'}
                assayTypes={(pub.authors_processed && pub.authors_processed.join(", ")) || pub.authors || ''}
                releaseDate={pub.releaseDate || ""}
                organisms={pub.publications || undefined}
                titleUrl={pub.url || undefined}
              />
            ))}
          </div>
          
          {/* Load More Button */}
          {hasMore && displayedPubs.length > 0 && (
            <div className="flex justify-center mt-8">
              <Button 
                onClick={() => loadMorePublications(page + 1)}
                disabled={loadingMore}
                variant="outline"
                size="lg"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Cargando...
                  </>
                ) : (
                  'Cargar más publicaciones'
                )}
              </Button>
            </div>
          )}
          
          {!hasMore && displayedPubs.length > 0 && (
            <p className="text-center text-muted-foreground mt-8">No hay más publicaciones para mostrar</p>
          )}
        </>
      )}
    </div>
  );
};
