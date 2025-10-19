package com.onemed1a.backend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.onemed1a.backend.dto.SearchRequest;
import com.onemed1a.backend.dto.SearchResultItem;
import com.onemed1a.backend.dto.SuggestResultItem;
import com.onemed1a.backend.service.SearchService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/media")
public class SearchController {

    private final SearchService service;

    /** Full results with filters; supports ?page=&size=&sort=title,asc */
    @GetMapping("/search")
    public Page<SearchResultItem> search(@ModelAttribute SearchRequest req, Pageable pageable) {
        return service.search(req, pageable);
    }

    /** Lightweight autocomplete (title prefix), default 5 items */
    @GetMapping("/suggest")
    public List<SuggestResultItem> suggest(@RequestParam String q,
                                           @RequestParam(defaultValue = "5") int limit) {
        return service.suggest(q, limit);
    }
}