import { useSelector } from "react-redux";

function formatCurrency(value) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function BalanceDisplay() {
  const { balance, isLoading } = useSelector((store) => store.account);

  return (
    <div className="balance">
      {!isLoading ? formatCurrency(balance) : "loading...."}
    </div>
  );
}

export default BalanceDisplay;
