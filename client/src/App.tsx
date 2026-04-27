import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 space-y-4">
      <h1 className="text-2xl font-semibold">shadcn smoke test</h1>
      <Card className="max-w-sm">
        <CardHeader>
          <CardTitle>Button check</CardTitle>
        </CardHeader>
        <CardContent>
          <Button>Click me</Button>
        </CardContent>
      </Card>
    </div>
  );
}
