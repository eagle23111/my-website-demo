package com.example.demo.repository;

import jooqdata.Tables;
import jooqdata.tables.pojos.Lot;
import jooqdata.tables.records.LotRecord;
import org.jooq.*;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class LotRepository {

    @Autowired
    private DSLContext dsl;

    private static final Map<String, Field<?>> SORT_FIELDS = Map.of(
            "lotName", Tables.LOT.LOT_NAME,
            "customerCode", Tables.LOT.CUSTOMER_CODE,
            "price", Tables.LOT.PRICE,
            "currencyCode", Tables.LOT.CURRENCY_CODE,
            "dateDelivery", Tables.LOT.DATE_DELIVERY
    );

    public Page<Lot> findAll(Pageable pageable, String lotName, String customerCode,
                             Double minPrice, Double maxPrice, String currency, String ndsRate,
                             String placeDelivery) {
        Condition condition = DSL.noCondition();

        if (lotName != null && !lotName.isBlank()) {
            condition = condition.and(Tables.LOT.LOT_NAME.likeIgnoreCase("%" + lotName + "%"));
        }
        if (customerCode != null && !customerCode.isBlank()) {
            condition = condition.and(Tables.LOT.CUSTOMER_CODE.eq(customerCode));
        }
        if (minPrice != null) {
            condition = condition.and(Tables.LOT.PRICE.ge(BigDecimal.valueOf(minPrice)));
        }
        if (maxPrice != null) {
            condition = condition.and(Tables.LOT.PRICE.le(BigDecimal.valueOf(maxPrice)));
        }
        if (currency != null && !currency.isBlank()) {
            condition = condition.and(Tables.LOT.CURRENCY_CODE.eq(currency));
        }
        if (ndsRate != null && !ndsRate.isBlank()) {
            condition = condition.and(Tables.LOT.NDS_RATE.eq(ndsRate));
        }
        if (placeDelivery != null && !placeDelivery.isBlank()) {
            condition = condition.and(Tables.LOT.PLACE_DELIVERY.eq(placeDelivery));
        }

        List<OrderField<?>> orderFields = pageable.getSort().stream()
                .map(order -> {
                    Field<?> field = SORT_FIELDS.get(order.getProperty());
                    return order.isAscending() ? field.asc() : field.desc();
                })
                .collect(Collectors.toList());

        List<Lot> content = dsl.selectFrom(Tables.LOT)
                .where(condition)
                .orderBy(orderFields)
                .limit(pageable.getPageSize())
                .offset(pageable.getOffset())
                .fetchInto(Lot.class);

        int total = dsl.fetchCount(
                dsl.selectFrom(Tables.LOT).where(condition)
        );

        return new PageImpl<>(content, pageable, total);
    }
    public Optional<Lot> findById(String lotName) {
        return Optional.ofNullable(
                dsl.selectFrom(Tables.LOT)
                        .where(Tables.LOT.LOT_NAME.eq(lotName))
                        .fetchOneInto(Lot.class)
        );
    }

    public Lot save(Lot lot) {
        LotRecord record = dsl.newRecord(Tables.LOT, lot);
        record.store();
        return record.into(Lot.class);
    }

    public Lot update(Lot lot) {
        dsl.update(Tables.LOT)
                .set(dsl.newRecord(Tables.LOT, lot))
                .where(Tables.LOT.LOT_NAME.eq(lot.getLotName()))
                .execute();
        return lot;
    }

    public void delete(String lotName) {
        dsl.deleteFrom(Tables.LOT)
                .where(Tables.LOT.LOT_NAME.eq(lotName))
                .execute();
    }
}
