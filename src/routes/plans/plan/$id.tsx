import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import {
  AlertTriangle,
  Calendar,
  ChevronLeft,
  Flag,
  MapPin,
  Pen,
  Share2,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import AddComment from "~/components/AddComment";
import { Confirmed } from "~/components/confirmed";
import InviteDialog from "~/components/Invite";
import PeopleJoinedDialog from "~/components/PeopleJoined";
import ReportPlan from "~/components/ReportPlan";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { capitalize } from "~/lib/utils";
import { usePlans } from "~/stores";
import { useComments } from "~/stores/comments";
import { Plan } from "~/types";

export const Route = createFileRoute("/plans/plan/$id")({
  component: PlanDetailPage,
});

function PlanDetailPage() {
  const { id } = Route.useParams();
  const { user } = useUser();
  const [plan, setPlan] = React.useState<Plan | null>(null);
  const { joinPlan, leavePlan, getPlanById } = usePlans();
  const { comments, getCommentsByPlanId } = useComments();
  const [showConfirmed, setShowConfirmed] = React.useState(false);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [peopleOpen, setPeopleOpen] = React.useState(false);
  const [commentOpen, setCommentOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getPlanById(id).then(setPlan);
      getCommentsByPlanId(id);
    }
  }, [id]);

  async function handleJoinPlan() {
    if (!plan || !user) return;
    await joinPlan(plan.id as string, user.id);
    setShowConfirmed(true);
  }

  async function handleLeavePlan() {
    if (!plan || !user) return;
    await leavePlan(plan.id as string, user.id);
    navigate({ to: "/" });
  }

  const handleShare = async () => {
    if (!plan) return;
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/plans/plan/${plan.id}`;
    await navigator.clipboard.writeText(url);
    toast.success("Enlace copiado al portapapeles");
  };

  if (!plan) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-10 md:w-1/2 md:mx-auto">
        <div className="relative h-[400px]">
          <img
            src={plan.image_url}
            alt={plan.title}
            className="absolute inset-0 w-full h-full object-cover md:rounded-xl"
          />
          <div
            className="absolute inset-0 md:rounded-xl"
            style={{
              background:
                "linear-gradient(rgba(0,0,0,0.5), transparent, rgba(0,0,0,0.8))",
            }}
          />

          <div className="p-4 flex-row mt-10 flex justify-between items-center absolute top-0 left-0 right-0 z-10">
            <button
              onClick={() => navigate({ to: "/" })}
              className="w-10 h-10 flex justify-center items-center bg-black/20 rounded-full hover:bg-black/30"
            >
              <ChevronLeft size={24} color="white" />
            </button>
            {user?.id === plan.creator_id && (
              <button
                onClick={() =>
                  navigate({
                    to: "/plans/create",
                    search: { id: plan.id },
                  })
                }
                className="w-10 h-10 flex justify-center items-center bg-black/20 rounded-full hover:bg-black/30"
              >
                <Pen size={20} color="white" />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 mt-4 md:px-8">
          <Text className="text-2xl w-full md:text-3xl font-bold mb-2">
            {plan.title}
          </Text>

          {(plan.reports || 0) > 10 && (
            <div className="bg-destructive/10 p-4 rounded-lg mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-primary" />
              <Text className="text-sm text-destructive flex-1">
                Este plan ha sido reportado múltiples veces. Te recomendamos ser
                precavido antes de unirte.
              </Text>
            </div>
          )}

          <div className="flex justify-between items-center mb-4 gap-1">
            <div>
              <div className="flex items-center mb-4 gap-1">
                <MapPin size={16} className="mr-1 text-primary" />
                <Text className="text-sm">{plan.location}</Text>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {plan.categories.map((interest, index) => (
                  <div
                    key={index}
                    className="bg-primary/10 px-3 py-1 rounded-full"
                  >
                    <Text className="text-sm text-primary">{interest}</Text>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                className="rounded-full"
                variant="ghost"
                onClick={handleShare}
              >
                <Share2 size={20} className="text-primary" />
              </Button>
              <Button
                size="icon"
                className="rounded-full"
                variant="ghost"
                onClick={() => setReportOpen(true)}
              >
                <Flag size={20} className="text-primary" />
              </Button>
            </div>
          </div>

          <div className="flex justify-between mb-6 items-center md:flex-row">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="mr-2 text-primary" />
              <Text>
                {capitalize(new Date(plan.date).toLocaleDateString("es"))} -{" "}
                {new Date(plan.date)
                  .toLocaleTimeString("es", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })
                  .toUpperCase()}
              </Text>
            </div>
            <button
              onClick={() => setPeopleOpen(true)}
              className="flex items-center gap-2"
            >
              <Users size={16} className="mr-2 text-primary" />
              <Text>
                {plan.participants.length}/{plan.max_participants}
              </Text>
            </button>
          </div>

          <div className="bg-muted p-4 rounded-lg md:p-6">
            <Text className="text-muted-foreground md:text-base">
              {plan.description}
            </Text>
          </div>
        </div>

        {user?.id !== plan.creator_id && (
          <div className="flex items-center gap-1 p-4 md:p-8">
            <Text className="text-sm text-muted-foreground">
              Organizado por
            </Text>
            <Link
              to="/plans/profile/$id"
              params={{ id: plan.creator_id }}
              className="text-sm font-semibold text-primary"
            >
              @{plan.profiles?.username || "usuario"}
            </Link>
          </div>
        )}

        {user?.id === plan.participants.find((id) => id === user?.id) &&
          user?.id !== plan.creator_id && (
            <Button
              size="lg"
              className="rounded-full m-4 md:mx-8 md:max-w-xs md:self-center"
              onClick={handleLeavePlan}
            >
              <Text className="text-white font-semibold">Salir del Plan</Text>
            </Button>
          )}

        {user?.id !== plan.participants.find((id) => id === user?.id) &&
          user?.id !== plan.creator_id && (
            <Button
              size="lg"
              className="m-4 mb-8 rounded-full md:mx-8 md:max-w-xs md:self-center"
              variant={plan.is_private ? "secondary" : "default"}
              onClick={
                plan.is_private ? () => setInviteOpen(true) : handleJoinPlan
              }
            >
              <Text className="font-semibold">
                {plan.is_private ? "Solicitar unirme" : "Unirme al plan"}
              </Text>
            </Button>
          )}

        <div className="mt-16 px-6 md:px-8">
          <div className="flex justify-between items-center mb-4">
            <Text className="text-2xl font-semibold">Comentarios</Text>
            <button
              onClick={() => setCommentOpen(true)}
              className="text-primary"
            >
              Comentar
            </button>
          </div>

          {comments.length > 0 ? (
            <div className="flex flex-col gap-4 md:max-w-2xl">
              {comments.map((comment) => (
                <div
                  className="flex items-center gap-2 mb-2"
                  key={comment.id}
                >
                  <Link to="/plans/profile/$id" params={{ id: comment.user_id }}>
                    <img
                      src={comment.profiles?.image_url ?? undefined}
                      alt=""
                      className="rounded-full w-10 h-10 object-cover"
                    />
                  </Link>
                  <div className="flex flex-col flex-wrap">
                    <div className="flex gap-2 items-center">
                      <Text className="font-medium text-muted-foreground">
                        {comment.profiles?.username}
                      </Text>
                      <Text className="text-sm">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </Text>
                    </div>
                    <Text className="font-medium">{comment.message}</Text>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-muted p-4 rounded-lg">
              <Text className="text-center text-muted-foreground">
                No hay comentarios aún
              </Text>
            </div>
          )}
        </div>

        {showConfirmed && (
          <Confirmed
            planTitle={plan.title}
            planImage={plan.image_url}
            userImage={user?.imageUrl as string}
            onClose={() => setShowConfirmed(false)}
            creatorPhone={plan.profiles?.phone}
          />
        )}
        <InviteDialog
          open={inviteOpen}
          onOpenChange={setInviteOpen}
          id={id}
        />
        <PeopleJoinedDialog
          open={peopleOpen}
          onOpenChange={setPeopleOpen}
          id={id}
        />
        <AddComment
          planId={id}
          userId={user?.id as string}
          open={commentOpen}
          onOpenChange={setCommentOpen}
        />
        <ReportPlan planId={id} open={reportOpen} onOpenChange={setReportOpen} />
      </div>
    </div>
  );
}
