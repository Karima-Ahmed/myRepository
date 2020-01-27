package com.mycompany.myapp.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import com.mycompany.myapp.web.rest.TestUtil;

public class MyEntityTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MyEntity.class);
        MyEntity myEntity1 = new MyEntity();
        myEntity1.setId(1L);
        MyEntity myEntity2 = new MyEntity();
        myEntity2.setId(myEntity1.getId());
        assertThat(myEntity1).isEqualTo(myEntity2);
        myEntity2.setId(2L);
        assertThat(myEntity1).isNotEqualTo(myEntity2);
        myEntity1.setId(null);
        assertThat(myEntity1).isNotEqualTo(myEntity2);
    }
}
