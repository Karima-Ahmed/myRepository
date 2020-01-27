package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.MayApp;
import com.mycompany.myapp.domain.MyEntity;
import com.mycompany.myapp.repository.MyEntityRepository;
import com.mycompany.myapp.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static com.mycompany.myapp.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link MyEntityResource} REST controller.
 */
@SpringBootTest(classes = MayApp.class)
public class MyEntityResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final Long DEFAULT_AGE = 1L;
    private static final Long UPDATED_AGE = 2L;

    private static final String DEFAULT_HOPPY = "AAAAAAAAAA";
    private static final String UPDATED_HOPPY = "BBBBBBBBBB";

    @Autowired
    private MyEntityRepository myEntityRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restMyEntityMockMvc;

    private MyEntity myEntity;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final MyEntityResource myEntityResource = new MyEntityResource(myEntityRepository);
        this.restMyEntityMockMvc = MockMvcBuilders.standaloneSetup(myEntityResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MyEntity createEntity(EntityManager em) {
        MyEntity myEntity = new MyEntity()
            .name(DEFAULT_NAME)
            .age(DEFAULT_AGE)
            .hoppy(DEFAULT_HOPPY);
        return myEntity;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MyEntity createUpdatedEntity(EntityManager em) {
        MyEntity myEntity = new MyEntity()
            .name(UPDATED_NAME)
            .age(UPDATED_AGE)
            .hoppy(UPDATED_HOPPY);
        return myEntity;
    }

    @BeforeEach
    public void initTest() {
        myEntity = createEntity(em);
    }

    @Test
    @Transactional
    public void createMyEntity() throws Exception {
        int databaseSizeBeforeCreate = myEntityRepository.findAll().size();

        // Create the MyEntity
        restMyEntityMockMvc.perform(post("/api/my-entities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myEntity)))
            .andExpect(status().isCreated());

        // Validate the MyEntity in the database
        List<MyEntity> myEntityList = myEntityRepository.findAll();
        assertThat(myEntityList).hasSize(databaseSizeBeforeCreate + 1);
        MyEntity testMyEntity = myEntityList.get(myEntityList.size() - 1);
        assertThat(testMyEntity.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testMyEntity.getAge()).isEqualTo(DEFAULT_AGE);
        assertThat(testMyEntity.getHoppy()).isEqualTo(DEFAULT_HOPPY);
    }

    @Test
    @Transactional
    public void createMyEntityWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = myEntityRepository.findAll().size();

        // Create the MyEntity with an existing ID
        myEntity.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restMyEntityMockMvc.perform(post("/api/my-entities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myEntity)))
            .andExpect(status().isBadRequest());

        // Validate the MyEntity in the database
        List<MyEntity> myEntityList = myEntityRepository.findAll();
        assertThat(myEntityList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllMyEntities() throws Exception {
        // Initialize the database
        myEntityRepository.saveAndFlush(myEntity);

        // Get all the myEntityList
        restMyEntityMockMvc.perform(get("/api/my-entities?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(myEntity.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].age").value(hasItem(DEFAULT_AGE.intValue())))
            .andExpect(jsonPath("$.[*].hoppy").value(hasItem(DEFAULT_HOPPY)));
    }
    
    @Test
    @Transactional
    public void getMyEntity() throws Exception {
        // Initialize the database
        myEntityRepository.saveAndFlush(myEntity);

        // Get the myEntity
        restMyEntityMockMvc.perform(get("/api/my-entities/{id}", myEntity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(myEntity.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.age").value(DEFAULT_AGE.intValue()))
            .andExpect(jsonPath("$.hoppy").value(DEFAULT_HOPPY));
    }

    @Test
    @Transactional
    public void getNonExistingMyEntity() throws Exception {
        // Get the myEntity
        restMyEntityMockMvc.perform(get("/api/my-entities/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateMyEntity() throws Exception {
        // Initialize the database
        myEntityRepository.saveAndFlush(myEntity);

        int databaseSizeBeforeUpdate = myEntityRepository.findAll().size();

        // Update the myEntity
        MyEntity updatedMyEntity = myEntityRepository.findById(myEntity.getId()).get();
        // Disconnect from session so that the updates on updatedMyEntity are not directly saved in db
        em.detach(updatedMyEntity);
        updatedMyEntity
            .name(UPDATED_NAME)
            .age(UPDATED_AGE)
            .hoppy(UPDATED_HOPPY);

        restMyEntityMockMvc.perform(put("/api/my-entities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedMyEntity)))
            .andExpect(status().isOk());

        // Validate the MyEntity in the database
        List<MyEntity> myEntityList = myEntityRepository.findAll();
        assertThat(myEntityList).hasSize(databaseSizeBeforeUpdate);
        MyEntity testMyEntity = myEntityList.get(myEntityList.size() - 1);
        assertThat(testMyEntity.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testMyEntity.getAge()).isEqualTo(UPDATED_AGE);
        assertThat(testMyEntity.getHoppy()).isEqualTo(UPDATED_HOPPY);
    }

    @Test
    @Transactional
    public void updateNonExistingMyEntity() throws Exception {
        int databaseSizeBeforeUpdate = myEntityRepository.findAll().size();

        // Create the MyEntity

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMyEntityMockMvc.perform(put("/api/my-entities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(myEntity)))
            .andExpect(status().isBadRequest());

        // Validate the MyEntity in the database
        List<MyEntity> myEntityList = myEntityRepository.findAll();
        assertThat(myEntityList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteMyEntity() throws Exception {
        // Initialize the database
        myEntityRepository.saveAndFlush(myEntity);

        int databaseSizeBeforeDelete = myEntityRepository.findAll().size();

        // Delete the myEntity
        restMyEntityMockMvc.perform(delete("/api/my-entities/{id}", myEntity.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<MyEntity> myEntityList = myEntityRepository.findAll();
        assertThat(myEntityList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
