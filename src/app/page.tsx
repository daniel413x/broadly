import { Button } from "@/components/ui/common/shadcn/button";
import { Checkbox } from "@/components/ui/common/shadcn/checkbox";
import { Input } from "@/components/ui/common/shadcn/input";
import { Progress } from "@/components/ui/common/shadcn/progress";
import { Textarea } from "@/components/ui/common/shadcn/textarea";

export default function Home() {
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <Button variant="elevated">
          test button
        </Button>
      </div>
      <div>
        <Input placeholder="type here" />
      </div>
      <div>
        <Progress value={33} />
      </div>
      <div>
        <Textarea placeholder="type here" />
      </div>
      <div>
        <Checkbox />
      </div>
    </div>
  );
}
