package com.example.demo.controllers;


import com.example.demo.repository.CustomerRepository;
import jooqdata.tables.pojos.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerRepository repository;

    @GetMapping
    public ResponseEntity<?> getCustomers(
            @RequestParam(required = false) String customerCode,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String inn,
            @RequestParam(required = false) Boolean isOrganization,
            @RequestParam(required = false) Boolean isPerson,
            @RequestParam(required = false) String customerKpp,
            @RequestParam(required = false) String customerLegalAddress,
            @RequestParam(required = false) String customerPostalAddress,
            @RequestParam(required = false) String customerEmail,
            @RequestParam(required = false) String customerCodeMain,
            @PageableDefault(size = 20) Pageable pageable) {

            Page<Customer> customers = repository.findAll(
                    customerCode,
                    pageable,
                    name,
                    inn,
                    isOrganization,
                    isPerson,
                    customerKpp,
                    customerLegalAddress,
                    customerPostalAddress,
                    customerEmail,
                    customerCodeMain
            );
            return ResponseEntity.ok(customers);

    }


    @PostMapping
    public ResponseEntity<Customer> create(@RequestBody Customer customer) {
        try {
            Customer saved = repository.save(customer);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{code}")
    public ResponseEntity<Customer> update(
            @PathVariable String code,
            @RequestBody Customer customer
    ) {
        if (!repository.findById(code).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Customer updatedCustomer = new Customer(
                code,
                customer.getCustomerName(),
                customer.getCustomerInn(),
                customer.getCustomerKpp(),
                customer.getCustomerLegalAddress(),
                customer.getCustomerPostalAddress(),
                customer.getCustomerEmail(),
                customer.getCustomerCodeMain(),
                customer.getIsOrganization(),
                customer.getIsPerson()
        );
        return ResponseEntity.ok(repository.update(updatedCustomer));
    }

    @DeleteMapping("/{code}")
    public ResponseEntity<Void> delete(@PathVariable String code) {
        if (!repository.findById(code).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        repository.delete(code);
        return ResponseEntity.noContent().build();
    }
}