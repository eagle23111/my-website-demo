package com.example.demo.repository;

import jooqdata.Tables;
import jooqdata.tables.pojos.Customer;
import jooqdata.tables.records.CustomerRecord;
import org.jooq.*;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


@Repository
public class CustomerRepository {

    @Autowired
    private DSLContext dsl;

    private static final Map<String, Field<?>> SORT_FIELDS = Map.of(
            "customerCode", Tables.CUSTOMER.CUSTOMER_CODE,
            "customerName", Tables.CUSTOMER.CUSTOMER_NAME,
            "customerInn", Tables.CUSTOMER.CUSTOMER_INN,
            "customerKpp", Tables.CUSTOMER.CUSTOMER_KPP,
            "isOrganization", Tables.CUSTOMER.IS_ORGANIZATION,
            "isPerson", Tables.CUSTOMER.IS_PERSON,
            "customerLegalAddress", Tables.CUSTOMER.CUSTOMER_LEGAL_ADDRESS,
            "customerPostalAddress", Tables.CUSTOMER.CUSTOMER_POSTAL_ADDRESS,
            "customerEmail", Tables.CUSTOMER.CUSTOMER_EMAIL,
            "customerCodeMain", Tables.CUSTOMER.CUSTOMER_CODE_MAIN
    );

    public Page<Customer> findAll(
            String customerCode,
            Pageable pageable,
            String name,
            String inn,
            Boolean isOrganization,
            Boolean isPerson,
            String customerKpp,
            String customerLegalAddress,
            String customerPostalAddress,
            String customerEmail,
            String customerCodeMain) {


        Condition condition = DSL.noCondition();
        if (customerCode != null && !customerCode.isBlank()) {
            condition = condition.and(Tables.CUSTOMER.CUSTOMER_CODE.likeIgnoreCase("%" + customerCode + "%"));
        }
        if (name != null && !name.isBlank()) {
            condition = condition.and(Tables.CUSTOMER.CUSTOMER_NAME.likeIgnoreCase("%" + name + "%"));
        }
        if (inn != null && !inn.isBlank()) {
            condition = condition.and(Tables.CUSTOMER.CUSTOMER_INN.eq(inn));
        }
        if (isOrganization != null) {
            condition = condition.and(Tables.CUSTOMER.IS_ORGANIZATION.eq(isOrganization));
        }
        if (isPerson != null) {
            condition = condition.and(Tables.CUSTOMER.IS_PERSON.eq(isPerson));
        }
        if (customerKpp != null && !customerKpp.isBlank()) {
            condition = condition.and(Tables.CUSTOMER.CUSTOMER_KPP.eq(customerKpp));
        }
        if (customerLegalAddress != null && !customerLegalAddress.isBlank()) {
            condition = condition.and(Tables.CUSTOMER.CUSTOMER_LEGAL_ADDRESS.likeIgnoreCase("%" + customerLegalAddress + "%"));
        }
        if (customerPostalAddress != null && !customerPostalAddress.isBlank()) {
            condition = condition.and(Tables.CUSTOMER.CUSTOMER_POSTAL_ADDRESS.likeIgnoreCase("%" + customerPostalAddress + "%"));
        }
        if (customerEmail != null && !customerEmail.isBlank()) {
            condition = condition.and(Tables.CUSTOMER.CUSTOMER_EMAIL.likeIgnoreCase("%" + customerEmail + "%"));
        }
        if (customerCodeMain != null && !customerCodeMain.isBlank()) {
            condition = condition.and(Tables.CUSTOMER.CUSTOMER_CODE_MAIN.likeIgnoreCase("%" + customerCodeMain + "%"));
        }

        List<OrderField<?>> orderFields = pageable.getSort().stream()
                .map(order -> {
                    Field<?> field = SORT_FIELDS.get(order.getProperty());
                    return order.isAscending() ? field.asc() : field.desc();
                })
                .collect(Collectors.toList());

        List<Customer> content = dsl.selectFrom(Tables.CUSTOMER)
                .where(condition)
                .orderBy(orderFields)
                .limit(pageable.getPageSize())
                .offset(pageable.getOffset())
                .fetchInto(Customer.class);

        int total = dsl.fetchCount(
                dsl.selectFrom(Tables.CUSTOMER).where(condition)
        );

        return new PageImpl<>(content, pageable, total);
    }

    public Optional<Customer> findById(String customerCode) {
        return Optional.ofNullable(
                dsl.selectFrom(Tables.CUSTOMER)
                        .where(Tables.CUSTOMER.CUSTOMER_CODE.eq(customerCode))
                        .fetchOneInto(Customer.class)
        );
    }

    public Customer save(Customer customer) {
        CustomerRecord record = dsl.newRecord(Tables.CUSTOMER);
        record.from(customer);
        record.store();
        return record.into(Customer.class);
    }

    public Customer update(Customer customer) {
        CustomerRecord record = dsl.newRecord(Tables.CUSTOMER);
        record.from(customer);
        dsl.executeUpdate(record);
        return record.into(Customer.class);
    }

    public void delete(String customerCode) {
        dsl.deleteFrom(Tables.CUSTOMER)
                .where(Tables.CUSTOMER.CUSTOMER_CODE.eq(customerCode))
                .execute();
    }
}
