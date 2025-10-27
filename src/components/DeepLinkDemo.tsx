import { Card } from './ui/card';
import { Button } from './ui/button';

export function DeepLinkDemo() {
  const handleShowExample = () => {
    // Scroll to first drop as demo
    const firstDrop = document.querySelector('[data-drop-id]');
    if (firstDrop) {
      firstDrop.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm z-40">
      <Card className="p-4 shadow-lg">
        <h4 className="mb-2">💡 Try Deep Linking</h4>
        <p className="text-sm text-muted-foreground mb-3">
          Click any Drop's "Copy Link" button to share with team members. 
          When they open the link, it will automatically scroll to that Drop.
        </p>
        <Button size="sm" variant="outline" onClick={handleShowExample}>
          View Example
        </Button>
      </Card>
    </div>
  );
}
