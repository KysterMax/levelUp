import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, Bug, Zap, Palette, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sounds } from '@/lib/sounds';
import type { CodeReview as CodeReviewType, CodeIssue, IssueType } from '@/types';
import { XP_REWARDS } from '@/types/gamification';

interface CodeReviewProps {
  exercise: CodeReviewType;
  onComplete: (score: number, xpEarned: number, timeSpent: number) => void;
}

const ISSUE_ICONS: Record<IssueType, typeof Bug> = {
  bug: Bug,
  performance: Zap,
  style: Palette,
  security: Shield,
};

const ISSUE_COLORS: Record<IssueType, string> = {
  bug: 'text-red-500',
  performance: 'text-amber-500',
  style: 'text-blue-500',
  security: 'text-violet-500',
};

export function CodeReview({ exercise, onComplete }: CodeReviewProps) {
  const [selectedLines, setSelectedLines] = useState<Set<number>>(new Set());
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [startTime] = useState(Date.now());

  const codeLines = exercise.code.split('\n');
  const issueLines = new Set(exercise.issues.map((i) => i.line));

  const toggleLine = (lineNumber: number) => {
    if (hasSubmitted) return;

    const newSelected = new Set(selectedLines);
    if (newSelected.has(lineNumber)) {
      newSelected.delete(lineNumber);
    } else {
      newSelected.add(lineNumber);
    }
    setSelectedLines(newSelected);
  };

  const handleSubmit = () => {
    setHasSubmitted(true);
    // Calculate score to determine sound
    const correctSelections = [...selectedLines].filter((line) => issueLines.has(line)).length;
    const scorePercent = (correctSelections / exercise.issues.length) * 100;
    if (scorePercent >= 50) {
      sounds.correct();
    } else {
      sounds.incorrect();
    }
  };

  const handleComplete = () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);

    // Calculate score
    const correctSelections = [...selectedLines].filter((line) => issueLines.has(line)).length;
    const falsePositives = [...selectedLines].filter((line) => !issueLines.has(line)).length;

    const maxScore = exercise.issues.length;
    const score = Math.max(0, correctSelections - falsePositives);
    const scorePercent = (score / maxScore) * 100;

    const xpEarned =
      scorePercent >= 80
        ? XP_REWARDS.review_complete
        : Math.round(XP_REWARDS.review_complete * (scorePercent / 100));

    onComplete(scorePercent, xpEarned, timeSpent);
  };

  const getLineStatus = (lineNumber: number) => {
    if (!hasSubmitted) return null;

    const isIssue = issueLines.has(lineNumber);
    const isSelected = selectedLines.has(lineNumber);

    if (isIssue && isSelected) return 'correct';
    if (isIssue && !isSelected) return 'missed';
    if (!isIssue && isSelected) return 'false-positive';
    return null;
  };

  const getIssueForLine = (lineNumber: number): CodeIssue | undefined => {
    return exercise.issues.find((i) => i.line === lineNumber);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full max-w-6xl mx-auto">
      {/* Code Panel */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{exercise.title}</CardTitle>
            <Badge
              className={cn(
                exercise.difficulty === 'junior' && 'bg-blue-100 text-blue-700',
                exercise.difficulty === 'mid' && 'bg-violet-100 text-violet-700',
                exercise.difficulty === 'senior' && 'bg-amber-100 text-amber-700'
              )}
            >
              {exercise.difficulty}
            </Badge>
          </div>
          <CardDescription>{exercise.description}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-lg bg-slate-900 overflow-hidden">
            <div className="p-4 border-b border-slate-700">
              <p className="text-sm text-slate-400">
                Clique sur les lignes qui contiennent des problèmes
              </p>
            </div>
            <div className="overflow-x-auto">
              <pre className="text-sm font-mono">
                {codeLines.map((line, index) => {
                  const lineNumber = index + 1;
                  const isSelected = selectedLines.has(lineNumber);
                  const status = getLineStatus(lineNumber);
                  const issue = hasSubmitted ? getIssueForLine(lineNumber) : null;

                  return (
                    <div
                      key={index}
                      onClick={() => toggleLine(lineNumber)}
                      className={cn(
                        'flex items-stretch cursor-pointer transition-colors',
                        !hasSubmitted && isSelected && 'bg-violet-900/50',
                        !hasSubmitted && !isSelected && 'hover:bg-slate-800',
                        status === 'correct' && 'bg-green-900/50',
                        status === 'missed' && 'bg-amber-900/50',
                        status === 'false-positive' && 'bg-red-900/30'
                      )}
                    >
                      <span className="w-12 text-right pr-4 py-1 text-slate-500 select-none border-r border-slate-700">
                        {lineNumber}
                      </span>
                      <code className="flex-1 px-4 py-1 text-slate-100">{line || ' '}</code>
                      {status && (
                        <span className="flex items-center px-2">
                          {status === 'correct' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {status === 'missed' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                          {status === 'false-positive' && <XCircle className="w-4 h-4 text-red-500" />}
                        </span>
                      )}
                      {issue && (
                        <span className="flex items-center px-2">
                          {(() => {
                            const Icon = ISSUE_ICONS[issue.type];
                            return <Icon className={cn('w-4 h-4', ISSUE_COLORS[issue.type])} />;
                          })()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Analyse du code</CardTitle>
          <CardDescription>
            {hasSubmitted
              ? `${selectedLines.size} lignes sélectionnées - ${exercise.issues.length} problèmes à trouver`
              : `Trouve les ${exercise.issues.length} problèmes dans ce code`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {!hasSubmitted ? (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium">Types de problèmes à chercher :</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(ISSUE_ICONS).map(([type, Icon]) => (
                    <div
                      key={type}
                      className="flex items-center gap-2 p-2 rounded bg-secondary text-sm"
                    >
                      <Icon className={cn('w-4 h-4', ISSUE_COLORS[type as IssueType])} />
                      <span className="capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">
                  Lignes sélectionnées : {selectedLines.size}
                </p>
                <Button
                  onClick={handleSubmit}
                  disabled={selectedLines.size === 0}
                  className="w-full"
                >
                  Valider ma review
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <p className="text-sm font-medium">Problèmes identifiés :</p>
                {exercise.issues.map((issue, index) => {
                  const Icon = ISSUE_ICONS[issue.type];
                  const wasFound = selectedLines.has(issue.line);

                  return (
                    <div
                      key={index}
                      className={cn(
                        'p-3 rounded-lg border',
                        wasFound
                          ? 'border-green-500 bg-green-50 dark:bg-green-950'
                          : 'border-amber-500 bg-amber-50 dark:bg-amber-950'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <Icon className={cn('w-4 h-4 mt-0.5', ISSUE_COLORS[issue.type])} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Ligne {issue.line}</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                issue.severity === 'high' && 'border-red-500 text-red-500',
                                issue.severity === 'medium' && 'border-amber-500 text-amber-500',
                                issue.severity === 'low' && 'border-blue-500 text-blue-500'
                              )}
                            >
                              {issue.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
                        </div>
                        {wasFound ? (
                          <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button onClick={handleComplete} className="w-full">
                Continuer
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
