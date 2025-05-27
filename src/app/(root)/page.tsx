import { Button } from "@/components/ui/common/shadcn/button";
import { Checkbox } from "@/components/ui/common/shadcn/checkbox";
import { Input } from "@/components/ui/common/shadcn/input";
import { Progress } from "@/components/ui/common/shadcn/progress";
import { Textarea } from "@/components/ui/common/shadcn/textarea";

function Home() {
  return (
    <main className="flex flex-col gap-y-4 p-6">
      <h1>
        Sell with us
      </h1>
      <div>
        <Button variant="elevated">
          test button
        </Button>
      </div>
      <div>
        <Input placeholder="type here" />
      </div>
      <div>
        <Progress value={33} aria-label="Progress" />
      </div>
      <div>
        <Textarea placeholder="type here" />
      </div>
      <div>
        <Checkbox aria-label="Toggle checkbox" />
      </div>
    </main>
  );
}

export default Home;
