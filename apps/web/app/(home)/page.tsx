import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import { Icon } from "@workspace/ui/components/icon";
export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-80px)] border">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon icon="iconoir:info-empty" />
          </EmptyMedia>
          <EmptyTitle data-testid="title-in-development">
            In Development!
          </EmptyTitle>
          <EmptyDescription>Waiting for Production Ready!</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
