import MyReviewsTable from "@/src/components/my-reviews-table";

const MyReviewsPage = () => {
  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">My Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Manage your event reviews and ratings.
        </p>
      </div>
      <MyReviewsTable />
    </section>
  );
};

export default MyReviewsPage;
