import React from 'react';
import { useAtom } from 'jotai';
import { artefactsStateAtom } from '../../modules/state/atoms';
import { Button } from '../ui';
import { 
  Image, 
  FileText, 
  Video, 
  Database, 
  Grid, 
  List,
  Download,
  Share,
  Trash2
} from 'lucide-react';

export const ArtefactsTab: React.FC = () => {
  const [artefactsState] = useAtom(artefactsStateAtom);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-4 h-4" />;
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'document':
        return <FileText className="w-4 h-4" />;
      case 'model':
        return <Database className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Image className="w-4 h-4" />
          <span className="font-medium">Artefacts</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              // Toggle view
            }}
          >
            {artefactsState.view === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Artefacts Grid/List */}
      <div className="flex-1 overflow-y-auto p-4">
        {artefactsState.artefacts.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Image className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No artefacts yet</p>
            <p className="text-xs">Generated content will appear here</p>
          </div>
        ) : (
          <div className={artefactsState.view === 'grid' ? 'grid grid-cols-2 gap-3' : 'space-y-2'}>
            {artefactsState.artefacts.map((artefact) => (
              <div
                key={artefact.id}
                className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-2">
                  {getTypeIcon(artefact.type)}
                  <span className="font-medium text-sm truncate">{artefact.name}</span>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {artefact.type} • {(artefact.size / 1024).toFixed(1)} KB
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {artefact.createdAt.toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 