/*
 * This file is generated by jOOQ.
 */
package jooqdata.tables.pojos;


import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;


/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Lot implements Serializable {

    private static final long serialVersionUID = 1L;

    private final String lotName;
    private final String customerCode;
    private final BigDecimal price;
    private final String currencyCode;
    private final String ndsRate;
    private final String placeDelivery;
    private final LocalDateTime dateDelivery;

    public Lot(Lot value) {
        this.lotName = value.lotName;
        this.customerCode = value.customerCode;
        this.price = value.price;
        this.currencyCode = value.currencyCode;
        this.ndsRate = value.ndsRate;
        this.placeDelivery = value.placeDelivery;
        this.dateDelivery = value.dateDelivery;
    }

    public Lot(
        String lotName,
        String customerCode,
        BigDecimal price,
        String currencyCode,
        String ndsRate,
        String placeDelivery,
        LocalDateTime dateDelivery
    ) {
        this.lotName = lotName;
        this.customerCode = customerCode;
        this.price = price;
        this.currencyCode = currencyCode;
        this.ndsRate = ndsRate;
        this.placeDelivery = placeDelivery;
        this.dateDelivery = dateDelivery;
    }

    /**
     * Getter for <code>purchase.lot.lot_name</code>.
     */
    public String getLotName() {
        return this.lotName;
    }

    /**
     * Getter for <code>purchase.lot.customer_code</code>.
     */
    public String getCustomerCode() {
        return this.customerCode;
    }

    /**
     * Getter for <code>purchase.lot.price</code>.
     */
    public BigDecimal getPrice() {
        return this.price;
    }

    /**
     * Getter for <code>purchase.lot.currency_code</code>.
     */
    public String getCurrencyCode() {
        return this.currencyCode;
    }

    /**
     * Getter for <code>purchase.lot.nds_rate</code>.
     */
    public String getNdsRate() {
        return this.ndsRate;
    }

    /**
     * Getter for <code>purchase.lot.place_delivery</code>.
     */
    public String getPlaceDelivery() {
        return this.placeDelivery;
    }

    /**
     * Getter for <code>purchase.lot.date_delivery</code>.
     */
    public LocalDateTime getDateDelivery() {
        return this.dateDelivery;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        final Lot other = (Lot) obj;
        if (this.lotName == null) {
            if (other.lotName != null)
                return false;
        }
        else if (!this.lotName.equals(other.lotName))
            return false;
        if (this.customerCode == null) {
            if (other.customerCode != null)
                return false;
        }
        else if (!this.customerCode.equals(other.customerCode))
            return false;
        if (this.price == null) {
            if (other.price != null)
                return false;
        }
        else if (!this.price.equals(other.price))
            return false;
        if (this.currencyCode == null) {
            if (other.currencyCode != null)
                return false;
        }
        else if (!this.currencyCode.equals(other.currencyCode))
            return false;
        if (this.ndsRate == null) {
            if (other.ndsRate != null)
                return false;
        }
        else if (!this.ndsRate.equals(other.ndsRate))
            return false;
        if (this.placeDelivery == null) {
            if (other.placeDelivery != null)
                return false;
        }
        else if (!this.placeDelivery.equals(other.placeDelivery))
            return false;
        if (this.dateDelivery == null) {
            if (other.dateDelivery != null)
                return false;
        }
        else if (!this.dateDelivery.equals(other.dateDelivery))
            return false;
        return true;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((this.lotName == null) ? 0 : this.lotName.hashCode());
        result = prime * result + ((this.customerCode == null) ? 0 : this.customerCode.hashCode());
        result = prime * result + ((this.price == null) ? 0 : this.price.hashCode());
        result = prime * result + ((this.currencyCode == null) ? 0 : this.currencyCode.hashCode());
        result = prime * result + ((this.ndsRate == null) ? 0 : this.ndsRate.hashCode());
        result = prime * result + ((this.placeDelivery == null) ? 0 : this.placeDelivery.hashCode());
        result = prime * result + ((this.dateDelivery == null) ? 0 : this.dateDelivery.hashCode());
        return result;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder("Lot (");

        sb.append(lotName);
        sb.append(", ").append(customerCode);
        sb.append(", ").append(price);
        sb.append(", ").append(currencyCode);
        sb.append(", ").append(ndsRate);
        sb.append(", ").append(placeDelivery);
        sb.append(", ").append(dateDelivery);

        sb.append(")");
        return sb.toString();
    }
}
