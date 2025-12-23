import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Markdown } from '@/components/ui/markdown';
import { Play, CheckCircle, XCircle, Lightbulb, Clock, Cpu, Eye, RotateCcw, Loader2 } from 'lucide-react';
import type { Monaco } from '@monaco-editor/react';

// Lazy load Monaco Editor for code splitting
const Editor = lazy(() => import('@monaco-editor/react'));
import { cn } from '@/lib/utils';
import { sounds } from '@/lib/sounds';
import type { CodeChallenge as CodeChallengeType } from '@/types';
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

interface CodeChallengeProps {
  exercise: CodeChallengeType;
  onComplete: (success: boolean, xpEarned: number, timeSpent: number) => void;
}

interface TestResult {
  passed: boolean;
  expected: unknown;
  received: unknown;
  description: string;
  error?: string;
}

export function CodeChallenge({ exercise, onComplete }: CodeChallengeProps) {
  // Load saved code from localStorage, or use starter code
  const [code, setCode] = useState(() => {
    const stored = getStoredCode(exercise.id);
    return stored || exercise.starterCode;
  });
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [startTime] = useState(Date.now());
  // Configure Monaco TypeScript on mount
  const handleEditorDidMount = (_editor: unknown, monaco: Monaco) => {

    // Configure TypeScript compiler options
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

    // Enable TypeScript diagnostics
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
    setTestResults([]);
    setHasCompleted(false);
  };

  // Strip TypeScript type annotations to convert to executable JavaScript
  const stripTypeScript = (tsCode: string): string => {
    return tsCode
      // Remove type annotations from parameters: (arr: number[], target: number) -> (arr, target)
      .replace(/:\s*\w+(\[\])?(\s*,|\s*\))/g, '$2')
      // Remove return type annotations: ): number { -> ) {
      .replace(/\):\s*\w+(\[\])?\s*(\{|=>)/g, ') $2')
      // Remove type assertions: as Type
      .replace(/\s+as\s+\w+/g, '')
      // Remove generic type parameters: <T> or <T, U>
      .replace(/<\w+(\s*,\s*\w+)*>/g, '')
      // Remove interface and type declarations
      .replace(/^(interface|type)\s+\w+.*$/gm, '')
      // Remove const assertions
      .replace(/\s+as\s+const/g, '');
  };

  const runTests = useCallback(async () => {
    setIsRunning(true);
    setTestResults([]);

    const results: TestResult[] = [];

    // Convert TypeScript to JavaScript
    const jsCode = stripTypeScript(code);

    for (const testCase of exercise.testCases) {
      try {
        // Create a function from the user's code
        const funcMatch = jsCode.match(/function\s+(\w+)/);
        if (!funcMatch) {
          results.push({
            passed: false,
            expected: testCase.expected,
            received: undefined,
            description: testCase.description,
            error: 'Aucune fonction trouvée dans le code',
          });
          continue;
        }

        const funcName = funcMatch[1];

        // Safely evaluate the code
        const wrappedCode = `
          ${jsCode}
          return ${funcName}(...args);
        `;

        const userFunc = new Function('args', wrappedCode);
        const result = userFunc(testCase.input);

        const passed = JSON.stringify(result) === JSON.stringify(testCase.expected);

        results.push({
          passed,
          expected: testCase.expected,
          received: result,
          description: testCase.description,
        });
      } catch (error) {
        results.push({
          passed: false,
          expected: testCase.expected,
          received: undefined,
          description: testCase.description,
          error: error instanceof Error ? error.message : 'Erreur inconnue',
        });
      }
    }

    setTestResults(results);
    setIsRunning(false);

    const allPassed = results.every((r) => r.passed);
    if (allPassed) {
      setHasCompleted(true);
      sounds.complete();
    } else {
      sounds.incorrect();
    }
  }, [code, exercise.testCases]);

  const handleComplete = () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const allPassed = testResults.every((r) => r.passed);
    const xpEarned = allPassed ? XP_REWARDS.challenge_complete : XP_REWARDS.challenge_partial;
    onComplete(allPassed, xpEarned, timeSpent);
  };

  const showNextHint = () => {
    if (!showHint) {
      setShowHint(true);
    } else if (currentHintIndex < exercise.hints.length - 1) {
      setCurrentHintIndex((prev) => prev + 1);
    }
  };

  const passedCount = testResults.filter((r) => r.passed).length;
  const totalTests = exercise.testCases.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
      {/* Left Panel - Instructions (1/3) */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline">{exercise.category}</Badge>
            <div className="flex items-center gap-2">
              {exercise.timeComplexity && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {exercise.timeComplexity}
                </Badge>
              )}
              {exercise.spaceComplexity && (
                <Badge variant="secondary" className="gap-1">
                  <Cpu className="w-3 h-3" />
                  {exercise.spaceComplexity}
                </Badge>
              )}
            </div>
          </div>
          <CardTitle>{exercise.title}</CardTitle>
          <Markdown className="mt-2">{exercise.description}</Markdown>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs defaultValue="tests">
            <TabsList className="w-full">
              <TabsTrigger value="tests" className="flex-1">
                Tests ({passedCount}/{totalTests})
              </TabsTrigger>
              <TabsTrigger value="hints" className="flex-1">
                Indices
              </TabsTrigger>
              <TabsTrigger value="solution" className="flex-1">
                Solution
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tests" className="space-y-2 mt-4">
              {exercise.testCases.map((testCase, index) => {
                const result = testResults[index];

                return (
                  <div
                    key={index}
                    className={cn(
                      'p-3 rounded-lg border text-sm',
                      result?.passed
                        ? 'border-green-500 bg-green-50 dark:bg-green-950'
                        : result
                          ? 'border-red-500 bg-red-50 dark:bg-red-950'
                          : 'border-border'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{testCase.description}</span>
                      {result && (
                        result.passed ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )
                      )}
                    </div>
                    <p className="font-mono text-xs text-muted-foreground">
                      Input: {JSON.stringify(testCase.input)}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      Expected: {JSON.stringify(testCase.expected)}
                    </p>
                    {result && !result.passed && (
                      <p className="font-mono text-xs text-red-600 dark:text-red-400">
                        {result.error
                          ? `Error: ${result.error}`
                          : `Got: ${JSON.stringify(result.received)}`}
                      </p>
                    )}
                  </div>
                );
              })}
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
                  <p className="text-sm text-muted-foreground mb-2">
                    Besoin d'aide ?
                  </p>
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
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-green-500" />
                      <span className="font-medium text-sm">Solution</span>
                    </div>
                    <pre className="text-xs font-mono bg-slate-900 text-slate-100 p-3 rounded overflow-x-auto">
                      <code>{exercise.solution}</code>
                    </pre>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCode(exercise.solution);
                      // Reset states to allow re-execution
                      setTestResults([]);
                      setHasCompleted(false);
                      setIsSubmitted(false);
                    }}
                    className="w-full"
                  >
                    Copier dans l'éditeur
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Bloqué ? Tu peux voir la solution.
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">
                    (Tu gagneras moins d'XP)
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSolution(true)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Révéler la solution
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
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
              onClick={runTests}
              disabled={isRunning}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? 'Exécution...' : 'Tester'}
            </Button>

            {hasCompleted && (
              <Button
                onClick={handleComplete}
                disabled={isSubmitted}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                {isSubmitted ? 'Traitement...' : `Terminer (+${XP_REWARDS.challenge_complete} XP)`}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
