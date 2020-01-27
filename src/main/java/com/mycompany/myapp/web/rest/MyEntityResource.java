package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.MyEntity;
import com.mycompany.myapp.repository.MyEntityRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; 
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.MyEntity}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MyEntityResource {

    private final Logger log = LoggerFactory.getLogger(MyEntityResource.class);

    private static final String ENTITY_NAME = "myEntity";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MyEntityRepository myEntityRepository;

    public MyEntityResource(MyEntityRepository myEntityRepository) {
        this.myEntityRepository = myEntityRepository;
    }

    /**
     * {@code POST  /my-entities} : Create a new myEntity.
     *
     * @param myEntity the myEntity to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new myEntity, or with status {@code 400 (Bad Request)} if the myEntity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/my-entities")
    public ResponseEntity<MyEntity> createMyEntity(@RequestBody MyEntity myEntity) throws URISyntaxException {
        log.debug("REST request to save MyEntity : {}", myEntity);
        if (myEntity.getId() != null) {
            throw new BadRequestAlertException("A new myEntity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        MyEntity result = myEntityRepository.save(myEntity);
        return ResponseEntity.created(new URI("/api/my-entities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /my-entities} : Updates an existing myEntity.
     *
     * @param myEntity the myEntity to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated myEntity,
     * or with status {@code 400 (Bad Request)} if the myEntity is not valid,
     * or with status {@code 500 (Internal Server Error)} if the myEntity couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/my-entities")
    public ResponseEntity<MyEntity> updateMyEntity(@RequestBody MyEntity myEntity) throws URISyntaxException {
        log.debug("REST request to update MyEntity : {}", myEntity);
        if (myEntity.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        MyEntity result = myEntityRepository.save(myEntity);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, myEntity.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /my-entities} : get all the myEntities.
     *

     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of myEntities in body.
     */
    @GetMapping("/my-entities")
    public List<MyEntity> getAllMyEntities() {
        log.debug("REST request to get all MyEntities");
        return myEntityRepository.findAll();
    }

    /**
     * {@code GET  /my-entities/:id} : get the "id" myEntity.
     *
     * @param id the id of the myEntity to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the myEntity, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/my-entities/{id}")
    public ResponseEntity<MyEntity> getMyEntity(@PathVariable Long id) {
        log.debug("REST request to get MyEntity : {}", id);
        Optional<MyEntity> myEntity = myEntityRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(myEntity);
    }

    /**
     * {@code DELETE  /my-entities/:id} : delete the "id" myEntity.
     *
     * @param id the id of the myEntity to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/my-entities/{id}")
    public ResponseEntity<Void> deleteMyEntity(@PathVariable Long id) {
        log.debug("REST request to delete MyEntity : {}", id);
        myEntityRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString())).build();
    }
}
