import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import { PiArrowArcLeftBold } from "react-icons/pi";
import type { PizzaComponentProps } from "../types.ts";

const PizzaComponent: React.FC<PizzaComponentProps> = ({
  item,
  activeItemId,
  handleActiveItem,
  handleToggleSize,
  handlePriceChange,
  hasChanges,
  handleUndo,
}) => {
  return (
    <section className="accordion-item" key={item.itemId}>
      <button
        className={`accordion-btn ${
          activeItemId === item.itemId ? "active" : ""
        }`}
        onClick={() => handleActiveItem(item.itemId)}
      >
        {activeItemId === item.itemId ? (
          <FaAngleUp className="btn-icon" />
        ) : (
          <FaAngleDown className="btn-icon" />
        )}
        {item.name}
      </button>
      {activeItemId === item.itemId && (
        <div className="pizza-container">
          {item.sizes.map((size) => (
            <div key={size.sizeId} className="size-row">
              <input
                type="checkbox"
                id={`size ${item.itemId} ${size.sizeId}`}
                checked={size.enabled}
                onChange={() => handleToggleSize(item.itemId, size.sizeId)}
              />
              <label
                className="check-label"
                htmlFor={`size ${item.itemId} ${size.sizeId}`}
              >
                {" "}
                {size.sizeName}{" "}
              </label>
              <div className="input-container">
                <label>$ </label>

                <input
                  type="number"
                  min={0}
                  disabled={!size.enabled}
                  value={size.price}
                  onChange={(e) => {
                    const value =
                      e.target.value === "" ? 0 : parseFloat(e.target.value);
                    handlePriceChange(item.itemId, size.sizeId, value);
                  }}
                />
              </div>
            </div>
          ))}
          {hasChanges(item) && (
            <button
              className="undo-btn"
              onClick={() => handleUndo(item.itemId)}
            >
              <PiArrowArcLeftBold />
            </button>
          )}
        </div>
      )}
    </section>
  );
};
export default PizzaComponent;
