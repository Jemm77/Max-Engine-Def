import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Beaker } from "lucide-react";
import { Link } from "react-router-dom";

interface PublicationCardProps {
  id: string;
  title: string;
  description: string;
  assayTypes?: string;
  organisms?: string;
  releaseDate?: string;
  titleUrl?: string;
}

export const PublicationCard = ({
  id,
  title,
  description,
  assayTypes,
  organisms,
  releaseDate,
  titleUrl,
}: PublicationCardProps) => {
  return (
    <Card className="p-6 bg-gradient-card border-border rounded-none">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {title || "Untitled Publication"}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {assayTypes || "No authors available"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {description && (
            <Badge variant="secondary" className="text-xs rounded-none">
              <Beaker className="w-3 h-3 mr-1" />
              {description}
            </Badge>
          )}
          {organisms && (
            <Badge variant="outline" className="text-xs rounded-none">
              {organisms}
            </Badge>
          )}
        </div>

        {releaseDate && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            {releaseDate}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button asChild variant="default" size="sm" className="flex-1 rounded-none">
            <Link to={`/publication/${id}`}>View Details</Link>
          </Button>
          {titleUrl && (
            <Button asChild variant="outline" size="sm" className="rounded-none">
              <a href={titleUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
