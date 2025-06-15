"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star, StarIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function RatingDialog() {
  const t = useTranslations("RequestStatusPage.ratingDialog");
  const tGeneral = useTranslations("RequestStatusPage");

  const [rating, setRating] = useState<number | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  const handleRatingSubmit = () => {
    if (rating) {
      // Here you would typically send the rating to your API
      console.log("Rating submitted:", rating, "Comment:", comment);
      setIsSubmitted(true);
    }
  };

  const resetRating = () => {
    setRating(null);
    setComment("");
    setIsSubmitted(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full gap-4">
          <Star />
          {tGeneral("rating")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {!isSubmitted ? (
          <>
            <DialogHeader>
              <DialogTitle>{t("title")}</DialogTitle>
              <DialogDescription>{t("description")}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="focus:outline-none transition duration-150"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(null)}
                    aria-label={`Rate ${star} stars`}
                  >
                    <StarIcon
                      className={`h-10 w-10 ${
                        (
                          hoveredRating !== null
                            ? star <= hoveredRating
                            : star <= (rating || 0)
                        )
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      } transition-all`}
                    />
                  </button>
                ))}
              </div>
            </div>
            {rating !== null && (
              <div className="text-center font-medium text-sm">
                {t(`stars.${rating}`)}
              </div>
            )}
            <Textarea
              placeholder={t("commentPlaceholder")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button
                type="button"
                disabled={!rating}
                onClick={handleRatingSubmit}
              >
                {t("submitRating")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("thankYou")}</DialogTitle>
              <DialogDescription>{t("thankYouDescription")}</DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon
                    key={star}
                    className={`h-8 w-8 ${
                      star <= (rating || 0)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetRating();
                }}
              >
                {t("rateAgain")}
              </Button>
              <Button type="button" onClick={() => setOpen(false)}>
                {t("close")}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
