package com.onemed1a.backend.service;

import com.onemed1a.backend.repository.MediaDataRepository;
import com.onemed1a.backend.dto.SearchRequest;
import com.onemed1a.backend.dto.SearchResultItem;
import com.onemed1a.backend.dto.SuggestResultItem;
import com.onemed1a.backend.mapper.SearchMappers;
import com.onemed1a.backend.repository.spec.MediaSearchSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    private final MediaDataRepository mediaRepo;

    public Page<SearchResultItem> search(SearchRequest req, Pageable pageable) {
        var spec = MediaSearchSpecification.from(req);
        return mediaRepo.findAll(spec, pageable)
                .map(SearchMappers::toResultItem);
    }

    public List<SuggestResultItem> suggest(String q, int limit) {
        int cap = Math.clamp(limit, 1, 10);
        Pageable firstN = PageRequest.of(0, cap, Sort.by(Sort.Direction.ASC, "title"));
        return mediaRepo.findAll(MediaSearchSpecification.suggestByPrefix(q), firstN)
                .map(SearchMappers::toSuggestItem)
                .getContent();
    }
}