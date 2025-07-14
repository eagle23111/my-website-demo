package com.example.demo.controllers;

import com.example.demo.repository.LotRepository;
import jooqdata.tables.pojos.Lot;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/lots")
public class LotController {

    @Autowired
    private LotRepository repository;

    @GetMapping
    public Page<Lot> getAll(
            @RequestParam(required = false) String lotName,
            @RequestParam(required = false) String customerCode,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String currencyCode,
            @RequestParam(required = false) String ndsRate,
            @RequestParam(required = false) String placeDelivery,
            @PageableDefault(size = 20) Pageable pageable) {
        /*
                "currencyCode": "USD",
                "placeDelivery": "Acme Warehouse, New York",
                "dateDelivery": "2023-12-15T10:00:00"*/
        return repository.findAll(pageable, lotName, customerCode,
                minPrice, maxPrice, currencyCode, ndsRate, placeDelivery);
    }

    @GetMapping("/{name}")
    public ResponseEntity<Lot> getByName(@PathVariable String name) {
        Optional<Lot> lot = repository.findById(name);
        return lot.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Lot> create(@RequestBody Lot lot) {
        try {
            Lot saved = repository.save(lot);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{name}")
    public ResponseEntity<Lot> update(
            @PathVariable String name,
            @RequestBody Lot lot
    ) {
        if (!repository.findById(name).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Lot updatedLot = new Lot(
                name,
                lot.getCustomerCode(),
                lot.getPrice(),
                lot.getCurrencyCode(),
                lot.getNdsRate(),
                lot.getPlaceDelivery(),
                lot.getDateDelivery()
        );
        return ResponseEntity.ok(repository.update(updatedLot));
    }

    @DeleteMapping("/{name}")
    public ResponseEntity<Void> delete(@PathVariable String name) {
        if (!repository.findById(name).isPresent()) {
            return ResponseEntity.notFound().build();
        }
        repository.delete(name);
        return ResponseEntity.noContent().build();
    }
}