import { FaAngleUp, FaAngleDown } from "react-icons/fa6";
import { PiArrowArcLeftBold } from "react-icons/pi";

interface PizzaComponentProps {
    item: Item;
    activeItemId: number | null;
    handleActiveItem: (id: number) => void;
    handleToggleSize: (itemId: number, sizeId: number) => void;
    handlePriceChange: (itemId: number, sizeId: number, price: number) => void;
    hasChanges: (itemId: number) => boolean;
    handleUndo: (itemId: number) => void;
  }

  const PizzaComponent: React.FC<PizzaComponentProps> = ({
    item,
    activeItemId,
    handleActiveItem,
    handleToggleSize,
    handlePriceChange,
    hasChanges,
    handleUndo
  })  => {
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
                      disabled={!size.enabled}
                      value={size.price.toFixed(2)}
                      onChange={(e) =>
                        handlePriceChange(
                          item.itemId,
                          size.sizeId,
                          parseFloat(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              ))}
              {hasChanges(item) && (
                <button className="undo-btn" onClick={handleUndo}>
                  <PiArrowArcLeftBold />
                </button>
              )}
            </div>
          )}
        </section>
  )
}
export default PizzaComponent