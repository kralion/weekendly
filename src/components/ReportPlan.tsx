import React from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Text } from "./ui/text";
import { Textarea } from "./ui/textarea";
import { usePlans } from "~/stores";

interface ReportPlanProps {
  planId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReportPlan({
  planId,
  open,
  onOpenChange,
}: ReportPlanProps) {
  const { reportPlan } = usePlans();
  const [report, setReport] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleReport = async () => {
    try {
      setIsLoading(true);
      await reportPlan(planId);
      onOpenChange(false);
      toast.success("Plan reportado con éxito");
    } catch {
      toast.error("No se pudo reportar el plan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reportar Plan</DialogTitle>
        </DialogHeader>
        <Textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder="Escribe tu reporte..."
          rows={4}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <Text>Cancelar</Text>
          </Button>
          <Button
            variant="destructive"
            onClick={handleReport}
            disabled={isLoading || report.length === 0}
          >
            {isLoading ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Text className="text-white">Reportar</Text>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
