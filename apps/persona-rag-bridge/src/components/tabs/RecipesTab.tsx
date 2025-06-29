import React from 'react';
import { useAtom } from 'jotai';
import { recipesStateAtom } from '../../modules/state/atoms';
import { Button } from '../ui';
import { 
  BookOpen, 
  Play, 
  Plus, 
  Settings, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

export const RecipesTab: React.FC = () => {
  const [recipesState] = useAtom(recipesStateAtom);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'running':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4" />
          <span className="font-medium">Recipes</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Recipes List */}
      <div className="flex-1 overflow-y-auto p-4">
        {recipesState.recipes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No recipes yet</p>
            <p className="text-xs">Create reusable workflows</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recipesState.recipes.map((recipe) => (
              <div
                key={recipe.id}
                className="border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">{recipe.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{recipe.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>v{recipe.version}</span>
                  <span>{recipe.author}</span>
                  <span>{recipe.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Executions */}
      {recipesState.executions.length > 0 && (
        <div className="border-t border-border p-4">
          <h3 className="text-sm font-medium mb-2">Recent Executions</h3>
          <div className="space-y-2">
            {recipesState.executions.slice(0, 3).map((execution) => (
              <div key={execution.id} className="flex items-center justify-between text-xs">
                <span className="truncate">{execution.recipeId}</span>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(execution.status)}
                  <span>{execution.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 