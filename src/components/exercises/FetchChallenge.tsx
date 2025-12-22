import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Markdown } from '@/components/ui/markdown';
import {
  CheckCircle,
  XCircle,
  Lightbulb,
  Globe,
  Send,
  Eye,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import type { Monaco } from '@monaco-editor/react';

// Lazy load Monaco Editor for code splitting
const Editor = lazy(() => import('@monaco-editor/react'));
import { cn } from '@/lib/utils';
import { sounds } from '@/lib/sounds';
import type { FetchChallenge as FetchChallengeType } from '@/types';
import { XP_REWARDS } from '@/types/gamification';

// Helper to get/set code from localStorage
const getStoredCode = (exerciseId: string): string | null => {
  try {
    return localStorage.getItem(`levelup_code_${exerciseId}`);
  } catch {
    return null;
  }
};

const setStoredCode = (exerciseId: string, code: string): void => {
  try {
    localStorage.setItem(`levelup_code_${exerciseId}`, code);
  } catch {
    // Ignore storage errors
  }
};

interface FetchChallengeProps {
  exercise: FetchChallengeType;
  onComplete: (success: boolean, xpEarned: number, timeSpent: number) => void;
}

interface FetchResult {
  success: boolean;
  status?: number;
  data?: unknown;
  error?: string;
  duration: number;
}

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  PUT: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  DELETE: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

export function FetchChallenge({ exercise, onComplete }: FetchChallengeProps) {
  // Load saved code from localStorage, or use starter code
  const [code, setCode] = useState(() => {
    const stored = getStoredCode(exercise.id);
    return stored || exercise.starterCode;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [fetchResult, setFetchResult] = useState<FetchResult | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [startTime] = useState(Date.now());

  // Configure Monaco TypeScript on mount
  const handleEditorDidMount = (_editor: unknown, monaco: Monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      noEmit: true,
      esModuleInterop: true,
      strict: true,
      skipLibCheck: true,
      allowJs: true,
    });

    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  };

  // Save code to localStorage whenever it changes
  useEffect(() => {
    if (code !== exercise.starterCode) {
      setStoredCode(exercise.id, code);
    }
  }, [code, exercise.id, exercise.starterCode]);

  // Reset code to starter code
  const resetCode = () => {
    setCode(exercise.starterCode);
    localStorage.removeItem(`levelup_code_${exercise.id}`);
    setFetchResult(null);
    setHasCompleted(false);
  };

  const runFetch = useCallback(async () => {
    setIsRunning(true);
    setFetchResult(null);

    const startRun = Date.now();

    try {
      // Create a function from the user's code and execute it
      const asyncFunction = new Function(`
        return (async () => {
          ${code}
          // Try to call the function if it exists
          if (typeof getUsers === 'function') return await getUsers();
          if (typeof fetchData === 'function') return await fetchData();
          if (typeof getData === 'function') return await getData();
          if (typeof postData === 'function') return await postData();
          if (typeof updateData === 'function') return await updateData();
          if (typeof deleteData === 'function') return await deleteData();
          throw new Error('Aucune fonction trouvée. Définis une fonction async.');
        })();
      `);

      const result = await asyncFunction();
      const duration = Date.now() - startRun;

      // Validate the response
      const { expectedResponse } = exercise;
      let isValid = true;

      if (expectedResponse.type === 'array') {
        isValid = Array.isArray(result);
        if (isValid && expectedResponse.minLength) {
          isValid = result.length >= expectedResponse.minLength;
        }
      } else if (expectedResponse.type === 'object') {
        isValid = typeof result === 'object' && result !== null && !Array.isArray(result);
        if (isValid && expectedResponse.requiredFields) {
          isValid = expectedResponse.requiredFields.every((field) => field in result);
        }
      }

      setFetchResult({
        success: isValid,
        status: 200,
        data: result,
        duration,
      });

      if (isValid) {
        setHasCompleted(true);
        sounds.complete();
      } else {
        sounds.incorrect();
      }
    } catch (error) {
      const duration = Date.now() - startRun;
      setFetchResult({
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        duration,
      });
      sounds.incorrect();
    }

    setIsRunning(false);
  }, [code, exercise]);

  const handleComplete = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const xpEarned = hasCompleted ? XP_REWARDS.fetch_complete : Math.round(XP_REWARDS.fetch_complete / 2);
    onComplete(hasCompleted, xpEarned, timeSpent);
  };

  const showNextHint = () => {
    if (!showHint) {
      setShowHint(true);
    } else if (currentHintIndex < exercise.hints.length - 1) {
      setCurrentHintIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
      {/* Left Panel - Instructions (1/3) */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500 flex-shrink-0" />
              <Badge variant="outline">API Challenge</Badge>
            </div>
            <Badge className={METHOD_COLORS[exercise.method]}>
              {exercise.method}
            </Badge>
          </div>
          <CardTitle className="text-lg leading-tight">{exercise.title}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {/* Description */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Markdown>{exercise.description}</Markdown>
          </div>

          {/* Endpoint Info */}
          <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <p className="text-xs text-muted-foreground mb-1">Endpoint</p>
            <code className="text-xs font-mono break-all block overflow-x-auto">{exercise.endpoint}</code>
          </div>

          <Tabs defaultValue="expected">
            <TabsList className="w-full">
              <TabsTrigger value="expected" className="flex-1">
                Attendu
              </TabsTrigger>
              <TabsTrigger value="hints" className="flex-1">
                Indices
              </TabsTrigger>
              <TabsTrigger value="solution" className="flex-1">
                Solution
              </TabsTrigger>
            </TabsList>

            <TabsContent value="expected" className="mt-4 space-y-3">
              <div className="p-3 rounded-lg border">
                <p className="text-sm font-medium mb-2">Réponse attendue :</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Type : <code className="bg-secondary px-1 rounded">{exercise.expectedResponse.type}</code></li>
                  {exercise.expectedResponse.minLength && (
                    <li>• Minimum {exercise.expectedResponse.minLength} éléments</li>
                  )}
                  {exercise.expectedResponse.requiredFields && (
                    <li>• Champs requis : {exercise.expectedResponse.requiredFields.join(', ')}</li>
                  )}
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="hints" className="mt-4">
              {showHint ? (
                <div className="space-y-2">
                  {exercise.hints.slice(0, currentHintIndex + 1).map((hint, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950 dark:border-amber-800"
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5" />
                        <p className="text-sm">{hint}</p>
                      </div>
                    </div>
                  ))}
                  {currentHintIndex < exercise.hints.length - 1 && (
                    <Button variant="ghost" size="sm" onClick={showNextHint}>
                      Indice suivant
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Button variant="outline" size="sm" onClick={showNextHint}>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Voir un indice
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="solution" className="mt-4">
              {showSolution ? (
                <div className="space-y-3">
                  <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-3 rounded overflow-x-auto">
                    <code>{exercise.solution}</code>
                  </pre>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCode(exercise.solution)}
                    className="w-full"
                  >
                    Copier dans l'éditeur
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">
                    (XP réduit si tu regardes)
                  </p>
                  <Button variant="outline" size="sm" onClick={() => setShowSolution(true)}>
                    <Eye className="w-4 h-4 mr-2" />
                    Révéler la solution
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Result Display */}
          {fetchResult && (
            <div
              className={cn(
                'p-4 rounded-lg border-l-4',
                fetchResult.success
                  ? 'bg-green-50 border-green-500 dark:bg-green-950'
                  : 'bg-red-50 border-red-500 dark:bg-red-950'
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                {fetchResult.success ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="font-medium">
                  {fetchResult.success ? 'Succès !' : 'Échec'}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {fetchResult.duration}ms
                </span>
              </div>
              {fetchResult.error ? (
                <p className="text-sm text-red-600 dark:text-red-400 font-mono">
                  {fetchResult.error}
                </p>
              ) : (
                <pre className="text-xs font-mono bg-background/50 p-2 rounded overflow-x-auto max-h-32">
                  {JSON.stringify(fetchResult.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Panel - Code Editor (2/3) */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Code</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetCode}
                className="text-muted-foreground hover:text-foreground"
                title="Réinitialiser le code"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Badge
                className={cn(
                  exercise.difficulty === 'junior' && 'bg-blue-100 text-blue-700',
                  exercise.difficulty === 'mid' && 'bg-violet-100 text-violet-700',
                  exercise.difficulty === 'senior' && 'bg-amber-100 text-amber-700'
                )}
              >
                +{exercise.xp} XP
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="border rounded-lg overflow-hidden h-[500px]">
            <Suspense fallback={
              <div className="h-full flex items-center justify-center bg-slate-900">
                <Loader2 className="w-6 h-6 animate-spin text-violet-500" />
              </div>
            }>
              <Editor
                height="100%"
                defaultLanguage="typescript"
                value={code}
                onChange={(value) => setCode(value || '')}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  wordWrap: 'on',
                  quickSuggestions: true,
                  suggestOnTriggerCharacters: true,
                  parameterHints: { enabled: true },
                }}
              />
            </Suspense>
          </div>

          <div className="flex justify-between gap-3">
            <Button
              variant="outline"
              onClick={runFetch}
              disabled={isRunning}
              className="flex-1"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {isRunning ? 'Exécution...' : 'Exécuter'}
            </Button>

            {hasCompleted && (
              <Button
                onClick={handleComplete}
                disabled={isSubmitted}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isSubmitted ? 'Traitement...' : `Terminer (+${XP_REWARDS.fetch_complete} XP)`}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
