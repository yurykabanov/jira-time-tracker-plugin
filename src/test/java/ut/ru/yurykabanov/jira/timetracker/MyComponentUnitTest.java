package ut.ru.yurykabanov.jira.timetracker;

import org.junit.Test;
import ru.yurykabanov.jira.timetracker.api.MyPluginComponent;
import ru.yurykabanov.jira.timetracker.impl.MyPluginComponentImpl;

import static org.junit.Assert.assertEquals;

public class MyComponentUnitTest {
    @Test
    public void testMyName() {
        MyPluginComponent component = new MyPluginComponentImpl(null);
        assertEquals("names do not match!", "myComponent", component.getName());
    }
}